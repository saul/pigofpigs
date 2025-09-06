namespace PigOfPigs.Data

open System.Threading.Tasks
open Microsoft.EntityFrameworkCore
open PigOfPigs.Models

type PigContext(options : PigContext DbContextOptions) =
    inherit DbContext(options)

    [<DefaultValue>]
    val mutable private players : Player DbSet
    member this.Players with get() = this.players and set(v) = this.players <- v

    [<DefaultValue>]
    val mutable private playerResults : PlayerResult DbSet
    member this.PlayerResults with get() = this.playerResults and set(v) = this.playerResults <- v

    [<DefaultValue>]
    val mutable private games : Game DbSet
    member this.Games with get() = this.games and set(v) = this.games <- v

    [<DefaultValue>]
    val mutable private roundPoints : RoundPoints DbSet
    member this.RoundPoints with get() = this.roundPoints and set(v) = this.roundPoints <- v

    override _.OnModelCreating(modelBuilder) =
        modelBuilder.Entity<Player>(fun e ->
            e.ToTable("Player") |> ignore
            e.Property(fun p -> p.Name).HasColumnType("TEXT COLLATE NOCASE") |> ignore
            e.HasIndex(fun p -> p.Name :> obj).IsUnique() |> ignore
        ) |> ignore

        modelBuilder.Entity<PlayerResult>().ToTable("PlayerResult") |> ignore
        modelBuilder.Entity<Game>().ToTable("Game") |> ignore

    member this.CreateGame(game : CreateGameRequest) = task {
        let rounds = game.Players |> Seq.map (fun p -> p.Scores.Length) |> Seq.max

        let maxRoundScores =
            [|
                for i in 0..rounds-1 ->
                    game.Players
                    |> Seq.map (fun p -> p.Scores.[i])
                    |> Seq.max
            |]

        let winningPoints = Array.last maxRoundScores

        let toPlayerResultAsync (createPlayer : CreateGamePlayer) =
            let finalScore, reverseRoundPoints =
                createPlayer.Scores
                |> Seq.indexed
                |> Seq.fold
                    (fun (scoreLastRound, points) (i, scoreThisRound) ->
                        let roundPoints =
                            RoundPoints(
                                Round=i + 1,
                                Points=scoreThisRound - scoreLastRound,
                                TrailingBy=maxRoundScores.[i] - scoreThisRound
                            )
                        scoreThisRound, roundPoints::points
                    )
                    (0, [])

            task {
                let! player = this.Players.FirstOrDefaultAsync(fun p -> p.Name = createPlayer.Name)
                return
                    PlayerResult(
                        Player=(if isNull player then Player(Name=createPlayer.Name) else player),
                        FinalScore=finalScore,
                        Winner=(finalScore = winningPoints),
                        RoundPoints=(reverseRoundPoints |> Seq.rev |> Array.ofSeq)
                    )
            }

        let! playerResults =
            Task.WhenAll [|
                for player in game.Players ->
                    for score in player.Scores do
                        if score < 0 then failwithf "Invalid score %d for player %s" score player.Name
                    toPlayerResultAsync player
            |]

        let game =
            Game(
                Title=game.Title,
                Date=game.Date,
                Results=playerResults
            )

        game
        |> this.Games.Add
        |> ignore

        let! _ = this.SaveChangesAsync()

        return game
    }

