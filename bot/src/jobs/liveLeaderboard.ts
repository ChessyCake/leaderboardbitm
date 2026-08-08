import { api } from "../services/api";

const { data } = await api.get('/api/v1/leaderboard/bot')

console.log(data)