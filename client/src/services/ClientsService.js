import api from './api'

let data = [ 
  {
    email: 'john@gmail.com',
    id: 159,
    login: 'Dead Man',
    firstName: 'John',
    lastName: 'Doe',
    account: 'gold',
    registered: '31.07.2017 - 22:29',
    visit: '24.02.2020 - 13:10',
  },{
    email: 'sem@gmail.com',
    id: 192,
    login: 'Sem',
    firstName: 'Semuel',
    lastName: 'Dzeshinsky',
    account: 'bronze',
    registered: '31.07.2017 - 22:29',
    visit: '24.02.2020 - 13:10',
  },{
    email: 'ed@gmail.com',
    id: 132,
    login: 'Eduardo',
    firstName: 'Edvard',
    lastName: 'Huelyo',
    account: 'silver',
    registered: '31.07.2017 - 22:29',
    visit: '24.02.2020 - 13:10',
  },{
    email: 'fred@gmail.com',
    id: 138,
    login: 'Fred',
    firstName: 'Frederic',
    lastName: 'Clarcson',
    account: 'bronze',
    registered: '31.07.2017 - 22:29',
    visit: '24.02.2020 - 13:10',
  },{
    email: 'max@gmail.com',
    id: 158,
    login: 'Maxus',
    firstName: 'Max',
    lastName: 'Minimus',
    account: 'platinum',
    registered: '22.07.2019 - 15:28',
    visit: '01.02.2020 - 12:14',
  },{
    email: 'den@gmail.com',
    id: 151,
    login: 'Denzel',
    firstName: 'Den',
    lastName: 'Brien',
    account: 'silver',
    registered: '10.03.2018 - 20:15',
    visit: '20.02.2020 - 11:54',
  },{
    email: 'ben@gmail.com',
    id: 143,
    login: 'Ben',
    firstName: 'Ben',
    lastName: 'Bob',
    account: 'vip',
    registered: '31.07.2017 - 22:29',
    visit: '24.02.2020 - 13:10',
  }
]

export default {
  getData(params) {
    // return api.get('clients', {params})
    return new Promise((resolve) => {
      let items = getDataArray()
      const { sortBy, sortDesc, page, itemsPerPage } = params
      const total = items.length

      if (sortBy.length === 1 && sortDesc.length === 1) {
        items = items.sort((a, b) => {
          const sortA = a[sortBy[0]]
          const sortB = b[sortBy[0]]
          console.log(sortDesc[0]);
          if (sortDesc[0]) {
            if (sortA < sortB) return 1
            if (sortA > sortB) return -1
            return 0
          } else {
            if (sortA < sortB) return -1
            if (sortA > sortB) return 1
            return 0
          }
        })
      }

      if (itemsPerPage > 0) {
        items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
      }

      setTimeout(() => {
        resolve({
          items,
          total,
        })
      }, 300)
    })

  },

  async update({id, ...userData}) {
    const editedItemIndex = data.findIndex(el => el.id === id)
    const newItem = {...data[editedItemIndex], ...userData}
    data[editedItemIndex] = newItem

    const update = new Promise(resolve => {
      setTimeout(() => resolve(data), 0)
    })
    const result = await update

    return result
  },

  async remove(id) {
    data = data.filter(el => el.id !== id)

    const deletion = new Promise(resolve => {
      setTimeout(() => resolve(data), 0)
    })
    const result = await deletion
    throw new Error('500 server error')
    return result
  }
}

function getDataArray() {
  return data.map(el => ({...el}))
}