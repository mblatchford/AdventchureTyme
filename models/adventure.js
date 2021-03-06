const db = require('./db');


class Adventure {

    constructor(id,name,creator){
        this.id = id;
        this.name = name;
        this.creator = creator

    }
    // CREATE
    // have to make creator a user id that is automatically passed in
    static createAdventure(name,creator){
        return db.one(`insert into adventures
        (name,creator)
        values
        ($1,$2)
        returning id
        `, [name,creator])
        .then(data => {
            return new Adventure(data.id,name,creator)
        })
    }
    // RETRIEVE
    static getAdventureByName(name){
        return db.one(`select * from adventures
        where name=$1`, [name])
            .then(data => {
                return new Adventure (data.id,data.name,data.creator)
            })
    }

    static getAdventureByID(id){
        return db.one(`select * from adventures
        where id=$1`, [id])
            .then(data => {
                return new Adventure (data.id,data.name,data.creator)
            })
    }

    static getAllAdventures(){
        return db.any(`select * from adventures
        `)
            .then(dataArray => {
                let adventureArray = dataArray.map(indAdventure => {
                    return new Adventure (indAdventure.id,indAdventure.name,indAdventure.creator)
                })
                return adventureArray
            })
    }

    static getAdventuresByUserId(id){
        return db.any(`select distinct adventures.name from userquestions
        join questions
        on questions.id = userquestions.question_id
        join adventures
        on adventures.id = questions.adventure_id
        where user_id = $1
        `,[id])
    }

    // for future use when users can create their own adventures
// static getAdventuresByCreator(creator){
//     return db.any(`select * from adventures
//     where creator=$1`, [creator])
//     .then(data => {
//         let adventureArray = data.map(indAdventure => {
//             return new Adventure(indAdventure.id,indAdventure.name,indAdventure.creator)
//         })
//         return adventureArray
//     })

// }
}

module.exports = Adventure