import { Request, Response } from "express"
import jwt from "jsonwebtoken"

import User from "../models/users.model";


export const googleCallback = ( req: Request, res: Response) => {
    const user = req.user as any

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email,
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: '7d',
        }
    );

    res.redirect(
        `${process.env.FRONTEND_URL}/login-success?token=${token}`
    )
};

export const getMe = async (req: Request, res: Response) => {

    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    const user = await User.findById((req.user as any).id);

    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    res.json(user);
};


export const getOnboardingStatus = async (req: Request, res: Response) => {
  const user = await User.findById((req.user as any).id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.json({
    onboarding: user.onboarded,
  });
};

export const questions = [
  {
    "contestId": 4,
    "index": "A",
    "name": "Watermelon",
    "url": "https://codeforces.com/problemset/problem/4/A"
  },
  {
    "contestId": 4,
    "index": "B",
    "name": "Before an Exam",
    "url": "https://codeforces.com/problemset/problem/4/B"
  },
  {
    "contestId": 71,
    "index": "A",
    "name": "Way Too Long Words",
    "url": "https://codeforces.com/problemset/problem/71/A"
  },
  {
    "contestId": 71,
    "index": "B",
    "name": "Progress Bar",
    "url": "https://codeforces.com/problemset/problem/71/B"
  },
  {
    "contestId": 1,
    "index": "A",
    "name": "Theatre Square",
    "url": "https://codeforces.com/problemset/problem/1/A"
  },
  {
    "contestId": 1,
    "index": "B",
    "name": "Spreadsheet",
    "url": "https://codeforces.com/problemset/problem/1/B"
  },
  {
    "contestId": 231,
    "index": "A",
    "name": "Team",
    "url": "https://codeforces.com/problemset/problem/231/A"
  },
  {
    "contestId": 231,
    "index": "B",
    "name": "Magic, Wizardry and Wonders",
    "url": "https://codeforces.com/problemset/problem/231/B"
  },
  {
    "contestId": 158,
    "index": "A",
    "name": "Next Round",
    "url": "https://codeforces.com/problemset/problem/158/A"
  },
  {
    "contestId": 158,
    "index": "B",
    "name": "Taxi",
    "url": "https://codeforces.com/problemset/problem/158/B"
  },
  {
    "contestId": 282,
    "index": "A",
    "name": "Bit++",
    "url": "https://codeforces.com/problemset/problem/282/A"
  },
  {
    "contestId": 282,
    "index": "B",
    "name": "Tails",
    "url": "https://codeforces.com/problemset/problem/282/B"
  },
  {
    "contestId": 50,
    "index": "A",
    "name": "Domino piling",
    "url": "https://codeforces.com/problemset/problem/50/A"
  },
  {
    "contestId": 50,
    "index": "B",
    "name": "Choosing Capital for Treeland",
    "url": "https://codeforces.com/problemset/problem/50/B"
  },
  {
    "contestId": 263,
    "index": "A",
    "name": "Beautiful Matrix",
    "url": "https://codeforces.com/problemset/problem/263/A"
  },
  {
    "contestId": 263,
    "index": "B",
    "name": "Squares",
    "url": "https://codeforces.com/problemset/problem/263/B"
  },
  {
    "contestId": 112,
    "index": "A",
    "name": "Petya and Strings",
    "url": "https://codeforces.com/problemset/problem/112/A"
  },
  {
    "contestId": 112,
    "index": "B",
    "name": "Petya and Countryside",
    "url": "https://codeforces.com/problemset/problem/112/B"
  },
  {
    "contestId": 339,
    "index": "A",
    "name": "Helpful Maths",
    "url": "https://codeforces.com/problemset/problem/339/A"
  },
  {
    "contestId": 339,
    "index": "B",
    "name": "Xenia and Spies",
    "url": "https://codeforces.com/problemset/problem/339/B"
  }
]

const max: number = questions.length;
const min: number = 0;

export async function getQuestion(req: Request, res: Response): Promise<void> {
    try {

        const userId = (req.user as any)._id
        if(!userId) {
            res.status(401).json({
                message: "User not authenticated"
            })
        }

        const randomInt: number = Math.floor(Math.random() * (max - min + 1) + min);
        const Updateduser= await User.findByIdAndUpdate(userId,{
            CfVerifyQ: questions[randomInt]
        })
        
        res.status(200).json({
            message: "Question ID sent successfully",
            question_Id: questions[randomInt],
            
        });

    } catch (error: unknown) {
        // In TypeScript, errors in catch blocks are of type 'unknown' by default.
        // It's safer to check if it's an Error object before accessing properties.
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        
        res.status(500).json({
            message: errorMessage
        });
    }
}

// Defined the shapes of the Codeforces API objects
interface CFProblem {
    contestId: number;
    index: string;
    verdict?: string;
}

interface CFSubmission {
    problem: CFProblem;
    creationTimeSeconds: number;
}

interface CFResponse {
    result: CFSubmission[];
}

export async function getusersubmissions(req: Request, res: Response): Promise<void> {
     
    try {
          const handle = req.body.codeforces_username
          // @ts-ignore: Cannot find name 'req'. (Bug preserved)
          const userId= req.user?._id
          if(!userId){
            // @ts-ignore: Cannot find name 'req'. (Bug preserved)
            res.status(401).json({
                message: "Unauthorized"
            })
          }

          const url= `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=5`;

          const Response = await fetch(url)
          const data = (await Response.json()) as CFResponse;
          const result: CFSubmission[] = data.result
          
          for(let i=0;i<result.length;i++) {
               let indicator= false;
               const contestId= result[i].problem.contestId

               const index= result[i].problem.index

               const systemTimings= Date.now()*1000 // Multiplied to convert milliseconds to seconds
               const creationTimeSeconds= result[i].creationTimeSeconds

               // @ts-ignore: Cannot find name 'question_Id'. (Bug preserved)
               if(question_Id.contestId == contestId && question_Id.index == index ) {
                    if(result[i].problem.verdict == 'COMPILATION_ERROR' && systemTimings-creationTimeSeconds <= 600){
                        indicator= true
                        const updatedUser = await User.findByIdAndUpdate(userId, {
                            verified: true,
                            CfVerifyQ: null
                        })
    
                        res.status(200).json({
                            message: "userAccount verified succesfully",
                            verified: indicator
                        })
                    }     
                }
               if(i== result.length-1 && indicator == false) {
                    res.status(408).json({
                        message: "Question submission not found or not completed within time"
                    })
                }
            }
    } catch (error: any) {
          
        res.status(500).json({
        error: error
        })
        
    }
}