require('dotenv').config()
const express = require('express')
const axios = require('axios')
const app = express()

app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', async (req, res) => {
  const pokemons = 'https://api.hubspot.com/crm/v3/objects/pokemons?properties=name,type,weakness'
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json',
  }
  try {
    const resp = await axios.get(pokemons, { headers })
    const data = resp.data.results
    // res.json(data)
    res.render('homepage', { title: 'Pokemons Custom objects | HubSpot APIs', data })
  } catch (error) {
    console.error(error)
  }
})
// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' })
})

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {
  const newPokemon = {
    id: req.body.id,
    properties: {
      name: req.body.name,
      type: req.body.type,
      weakness: req.body.weakness,
    },
  }
  const pokemonsUrl = 'https://api.hubapi.com/crm/v3/objects/pokemons'
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json',
  }
  try {
    await axios.post(pokemonsUrl, newPokemon, { headers })
    res.redirect('/')
  } catch (error) {
    console.error(error)
    res.status(500).send('Error creating new pokemon')
  }
})

// Extra

app.get('/edit-cobj', async (req, res) => {
  // http://localhost:3000/edit-cobj?id=6496797157
  const id = req.query.id
  const editPokemon = `https://api.hubspot.com/crm/v3/objects/2-131495119/${id}?portalId=145079411&properties=name,type,weakness`

  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json',
  }

  try {
    const resp = await axios.get(editPokemon, { headers })
    const data = resp.data
    res.render('edit', {
      title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
      id: id,
      name: data.properties.name,
      type: data.properties.type,
      weakness: data.properties.weakness,
    })
  } catch (error) {
    console.error(error)
  }
})

app.post('/edit-cobj', async (req, res) => {
  const id = req.body.id
  const editPokemon = {
    id: id,
    properties: {
      name: req.body.newName,
      type: req.body.newType,
      weakness: req.body.newWeakness,
    },
  }

  const pokemonsUrl = `https://api.hubspot.com/crm/v3/objects/2-131495119/${id}?portalId=145079411&properties=name,type,weakness`
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json',
  }

  try {
    await axios.patch(pokemonsUrl, editPokemon, { headers })
    res.redirect('/')
  } catch (error) {
    console.error(error)
  }
})

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'))
