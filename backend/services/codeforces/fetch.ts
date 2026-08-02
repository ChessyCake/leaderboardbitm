interface SyncResult {
    totalSolved: number;
    todaySolved: number;
    streak: number;
    lastSolvedDay: number | null;
    lastSubmissionId: number;
}

const ONE_DAY = 24 * 60 * 60 * 1000;

const day = (time: number) =>
    new Date(time * 1000).setHours(0, 0, 0, 0);

export const fetchUserInfo = async (
    username: string,
    lastSubmissionId: number,
    lastSolvedDay: number | null,
    currentStreak: number,
    currentTotalSolved: number
): Promise<SyncResult | null> => {

    const count = lastSubmissionId === 0 ? 1000 : 100;

    const res = await fetch(
        `https://codeforces.com/api/user.status?handle=${username}&from=1&count=${count}`
    );

    const data = await res.json();

    if (data.status !== "OK") return null;

    const submissions = data.result;

    if (!submissions.length) return null;

    const today = new Date().setHours(0,0,0,0);

    const accepted = submissions.filter(
        (sub:any)=>sub.verdict==="OK"
    );

    const uniqueProblems = new Set<string>();

    const solvedDays = new Set<number>();

    for(const sub of accepted){

        uniqueProblems.add(
            `${sub.problem.contestId}-${sub.problem.index}`
        );

        solvedDays.add(
            day(sub.creationTimeSeconds)
        );

    }

    const todayProblems = new Set<string>();

    for(const sub of accepted){

        if(day(sub.creationTimeSeconds)===today){

            todayProblems.add(
                `${sub.problem.contestId}-${sub.problem.index}`
            );

        }

    }

    const todaySolved = todayProblems.size;


    if(lastSubmissionId===0){

        const orderedDays = [...solvedDays]
            .sort((a,b)=>b-a);

        let streak = 0;

        if(orderedDays.length){

            let current = orderedDays[0];

            streak = 1;

            for(let i=1;i<orderedDays.length;i++){

                if(current-orderedDays[i]===ONE_DAY){

                    streak++;

                    current=orderedDays[i];

                }else{

                    break;

                }

            }

        }

        return{

            totalSolved: uniqueProblems.size,

            todaySolved,

            streak,

            lastSolvedDay:
                orderedDays.length?
                orderedDays[0]:
                null,

            lastSubmissionId:
                submissions[0].id

        };

    }

    const newAccepted = accepted.filter(
        (sub:any)=>sub.id>lastSubmissionId
    );

    if(!newAccepted.length){

        return{

            totalSolved:currentTotalSolved,

            todaySolved,

            streak:currentStreak,

            lastSolvedDay,

            lastSubmissionId:
                submissions[0].id

        };

    }

    const newProblems = new Set<string>();

    const newDays = new Set<number>();

    for(const sub of newAccepted){

        newProblems.add(
            `${sub.problem.contestId}-${sub.problem.index}`
        );

        newDays.add(
            day(sub.creationTimeSeconds)
        );

    }

    let streak=currentStreak;

    let latestSolvedDay=lastSolvedDay;

    const orderedNewDays=[...newDays].sort((a,b)=>a-b);

    for(const d of orderedNewDays){

        if(latestSolvedDay===null){

            streak=1;

        }else{

            const diff=(d-latestSolvedDay)/ONE_DAY;

            if(diff===0){

              

            }else if(diff===1){

                streak++;

            }else{

                streak=1;

            }

        }

        latestSolvedDay=d;

    }

    return{

        totalSolved:
            currentTotalSolved+
            newProblems.size,

        todaySolved,

        streak,

        lastSolvedDay:latestSolvedDay,

        lastSubmissionId:
            submissions[0].id

    };

};