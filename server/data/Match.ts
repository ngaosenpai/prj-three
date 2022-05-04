import { IUser, IRoom } from "./types";

function randomBin(min = 0, max = 2) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

class Match{
  users: Array<IUser> = [];
  id : IRoom['id'];
  roomName : string;
  turnControl : { [key in IUser['id']] : IUser['id'] }
  userChess : { [key in IUser['id']] : "red" | "blue" }
  currentTurn : IUser['id']
  isReady = false

  constructor(id: string, roomName: string){
    this.id = id
    this.roomName = roomName
    this.turnControl = {}
    this.currentTurn = ""
    this.userChess = {}
  }

  userJoin(user: IUser){
    this.users.push(user)
    if(this.users.length === 2){
      const user1 = this.users[0]
      const user2 = this.users[1]
      this.turnControl[user1.id] = user2.id
      this.turnControl[user2.id] = user1.id
      const random = randomBin()
      this.currentTurn = this.users[random].id
      this.isReady = true
      const chesses : Array<'red' | 'blue'> = ['red', 'blue']
      this.userChess[user1.id] = chesses[random]
      this.userChess[user2.id] = chesses[1-random]
    }
  }

  getNextTurn(){
    const nextTurn = this.turnControl[this.currentTurn]
    this.currentTurn = nextTurn
    return nextTurn
  }

}


class MatchManage{
  matchs : Record<Match['id'], Match>
  constructor(){
    this.matchs = {}
  }

  joinMatch(matchId : Match['id'], user: IUser, roomName: string){
    const match = this.matchs[matchId]
    if(match){
      match.userJoin(user)
      return match
    } else {
      const newMatch = new Match(matchId, roomName)
      newMatch.userJoin(user)
      this.matchs[newMatch.id] = newMatch
      return newMatch
    }
  }

  findMatch(matchId : Match['id']){
    return this.matchs[matchId]
  }
  
  deleteMatch(matchId : Match['id']){
    const match = this.matchs[matchId]
    delete this.matchs[matchId]
    return match
  }

}

const MatchManageDB = new MatchManage()

export default MatchManageDB
export type {
  Match
}