// Importeer express uit de node_modules map
import express from 'express'
// Maak een nieuwe express app aan
const app = express()
// Stel ejs in als template engine en geef de 'views' map door
app.set('view engine', 'ejs')
app.set('views', './views')
// Gebruik de map 'public' voor statische resources
app.use(express.static('public'))

/* 
  ROUTES AND FETCH
*/

/*
INDEX
- Link naar search-member
- Query squads voor menu naar squad-page
*/
app.get('/', function (request, response) {
  // const url = 'https://whois.fdnd.nl/api/v1/squads';
  // const url = "https://whois.fdnd.nl/api/v1/members?squad=squat-c-2022" //max 10
  // const url = "https://whois.fdnd.nl/api/v1/squad/squad-b-2022"
  let allMembers = []
  let count = 0

  let url = "https://whois.fdnd.nl/api/v1/squad/squad-a-2022"
  fetchJson(url).then((data) => {
    data.squad.members.forEach(member => { allMembers.push(member) })
    renderIndex()
  })
  url = "https://whois.fdnd.nl/api/v1/squad/squad-b-2022"
  fetchJson(url).then((data) => {
    data.squad.members.forEach(member => { allMembers.push(member) })
    renderIndex()
  })
  url = "https://whois.fdnd.nl/api/v1/squad/squat-c-2022"
  fetchJson(url).then((data) => {
    data.squad.members.forEach(member => { allMembers.push(member) })
    renderIndex()
  })

  function renderIndex(){
    count++
    // console.log("renderIndex",count)
    // console.log(allMembers.length)
    if(count == 3) {
      // allMembers = {...allMembers}
      allMembers = allMembers.sort((a, b) => {
        var nameA = a.name.toUpperCase(); // ignore upper and lowercase
        var nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1; //name A comes first
        }
        if (nameA > nameB) {
          return 1; // name B comes first
        }
        return 0;  // names must be equal


      });
    
      response.render('index', {data: allMembers} )
    }
  }

})



/*
SQUAD
- Query squad members voor foto's
*/

//Route voor een squad overzicht om studenten te zoeken
app.get('/squad/:id', function (request, response) {
  // console.log("query",request.query);
  // console.log("params",request.params)

  //fetch all members per squad
  // const url = https://whois.fdnd.nl/api/v1/members?squad=squat-c-2022
  // const url = https://whois.fdnd.nl/api/v1/squad/squad-a-2022?orderBy=name&direction=ASC
  // const url = "https://whois.fdnd.nl/api/v1/squad/squat-c-2022"
  const id = request.params.id;
  const url = 'https://whois.fdnd.nl/api/v1/squad/'+id+"?orderBy=name&direction=ASC";
  console.log("url",url)

  fetchJson(url).then((data) => {
    // console.log(data.squad.members.length)
    // console.log("data",data.members)
    response.render('squad', data)
  })
})




/*
SEARCH MEMBER
- Datalist met alle members 
*/

// //Route voor memebers om namen te zoeken
// app.get('/members', function (request, response) {

//   // const url = "https://whois.fdnd.nl/api/v1/member/koop-reynders"
//   const url = "https://whois.fdnd.nl/api/v1/squad/squat-c-2022"
//   // const url = 'https://whois.fdnd.nl/api/v1/squads';
//   fetchJson(url).then((data) => {
//     response.render('members', data)
//   })
//   // console.log("query",request.query);

//   // const first = "100";
//   // const order = "name";
//   // const direction = "ASC";
//   // let url = "https://whois.fdnd.nl/api/v1/members"
//   // url = url+"?first="+first+"&orderBy="+order+"&direction="+direction;

//   // const urlSquads = "https://whois.fdnd.nl/api/v1/squads/"  
//   // let url = "https://whois.fdnd.nl/api/v1/squad"
//   // let count = 0
//   // let memberList = []
//   // // console.log("url",url)
//   // fetchJson(urlSquads).then((data) => {
//   //   console.log("SQUAD DATA")
//   //   //fetch data for each squad
//   //   const squadsData = data.squads
//   //   squadsData.forEach(squad => {
//   //     if (squad.slug == "minor-web-2023") return
//   //     console.log("getSquadData",squad.name)
//   //     //https://whois.fdnd.nl/api/v1/squad/founders-2021?orderBy=name&direction=ASC

//   //     url = url + "/" + squad.slug + "?orderBy=name&direction=ASC"
//   //     // console.log("url", url)
//   //     fetchJson(url).then((squadData) => {
//   //       console.log("squadData",squadData.squad.name)
//   //       setSquadData(squadData)
//   //     })
//   //   })

//   //   function setSquadData(squadData){
//   //     console.log("setSquadData",squadData)
//   //     memberList.push(squadData.squad.members)
//   //     count++
//   //     if(count==squadsData.length-1){
//   //       console.log("memberList",memberList.length)
//   //       response.render('members', {data: memberList})
//   //     }    
//   //   }
//   // })

// })


/* 
  SERVER SETTINGS
*/
// Stel het poortnummer in waar express op gaat luisteren
app.set('port', process.env.PORT || 8000)
// Start express op, haal het ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})


/**
 * Wraps the fetch api and returns the response body parsed through json
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
async function fetchJson(url, payload = {}) {
  return await fetch(url, payload)
    .then((response) => response.json())
    .catch((error) => error)
}

/** 
 * Gebruikte bronnen
 * 
 * Nodemon reload, automatically.
 * https://nodemon.io
 * nodemon ./app.js
 *
 * How to use async and await in a forEach JS loop
 * https://learn.coderslang.com/0144-how-to-use-async-and-await-in-a-foreach-js-loop/
 * 
*/