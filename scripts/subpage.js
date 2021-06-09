
let pageState = {
    loaded: false,
    dataLoaded: false,
}

const backgroundData = [
    {
        image: '1.jpg',
        title: 'Musée d’Orsay',
        author: 'by @RobynNicholl'
    },
    {
        image: '2.jpg',
        title: 'Phoenicia Diner',
        author: 'by @CoralAmiga'
    },
    {
        image: '3.jpg',
        title: 'Fondation Maeght',
        author: 'by @ArminTehrani'
    },
    {
        image: '4.jpg',
        title: 'Mott 32',
        author: 'by @AndreasShaw'
    },
]

const selectBackground = () => {
    let selectedBackground = sessionStorage.getItem('background');
    selectedBackground = Math.floor(Math.random() * backgroundData.length)
    sessionStorage.setItem('background', selectedBackground);
    document.getElementById('background')
        .style.backgroundImage = `url(./assets/images/${backgroundData[selectedBackground].image})`
    document.getElementById('background-description__title')
        .innerHTML = backgroundData[selectedBackground].title
    document.getElementById('background-description__author')
        .innerHTML = backgroundData[selectedBackground].author
    document.getElementById('background-description')
        .style.display = 'flex'
}

window.addEventListener('DOMContentLoaded', () => {
    selectBackground();
    pageState = {
        ...pageState,
        loaded: true,
        dataLoaded: true
    }
})

window.addEventListener('load', () => {
    const spinner = document.getElementById('spinner')
    pageState = {
        ...pageState,
        loaded: true
    }

    const checkIfLoaded = setInterval(() => {
        if (pageState.loaded) {
            spinner.classList.add('loaded')
            clearInterval(checkIfLoaded)
        }
    }, 200)
})
