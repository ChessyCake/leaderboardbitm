import mongoose from 'mongoose'
import cfstats from '../models/cfstats.model'

export async function totalActive(req,res) {

    const Model= cfstats
    const lastSolvedDay= cfstats.lastSolvedDay

    const lastSolvedDayValue= await Model.find({
        lastSolvedDay
    })
    let count=0;
    for(let i=0;i<lastSolvedDayValue.length;i++){
        const currentTime= Date.now();
        const Difference= currentTime- lastSolvedDayValue[i]
        const DifferenceInHours= Math.floor(Difference/ (1000 * 60 * 60)) 
        if(DifferenceInHours<24){
            count++;
        }
    }
    return res.status(200).json({
        message: "Total Active Fetched successfully",
        count
    });
}

export async function totalCfSolved(res,req) {
    
    const Model= mongoose.Model("codeforces")
}