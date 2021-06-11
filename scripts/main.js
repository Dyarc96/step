import { validateEmail } from './common.js'

const waitingListUrl = 'https://api.wait.stepyourworld.com'

let pageState = {
    loaded: false,
    currentSection: 0
}

let subscriberState = {
    status: undefined,
    value: '',
    isValid: false,
    hasError: false,
    errorMessage: '',
    messageDisplay: 'none',
    isShown: false,
    amount: 0
}

const descriptions = [
    {
        id: 0,
        title: 'Musee du Louvre-Lens',
        author: ''
    },
    {
        id: 1,
        title: 'Brasilia Funarte',
        author: 'Geraldo Zamrponi'
    },
    {
        id: 2,
        title: 'Neon Tunnel',
        author: '127 John Street, NYC'
    }
]

const subscribe = (email) => {
    const options = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: `${email}`.toLowerCase(),
        })
    }
    return fetch(`${waitingListUrl}/members/subscribe`, options).then(res => res.json())
}

window.addEventListener('DOMContentLoaded', () => {

    const subscriber = document.getElementById('subscriber'),
        notifyButton = document.getElementById('newsletter-button'),
        arrowUp = document.getElementById('arrow-up'),
        arrowDown = document.getElementById('arrow-down')

    function setSectionContent() {
        const index = Math.round(window.scrollY / window.innerHeight)
        setPhotoSignature(index)
        setArrows(index)
        pageState = {
            ...pageState,
            currentSection: index
        }
    }

    function setPhotoSignature(sectionNumber) {
        document.getElementById('background-description__author').innerHTML = descriptions[sectionNumber].author
        document.getElementById('background-description__title').innerHTML = descriptions[sectionNumber].title
    }

    function setArrows(sectionNumber) {
        const text = document.querySelector('.navigation__text');
        switch(sectionNumber) {
            case 0:
                arrowUp.classList.add('hidden');
                arrowDown.classList.remove('hidden');
                text.classList.remove('hidden');
                break;
            case 1:
                arrowUp.classList.remove('hidden');
                arrowDown.classList.remove('hidden');
                text.classList.add('hidden');
                break;
            case 2:
                arrowUp.classList.remove('hidden');
                arrowDown.classList.add('hidden');
                text.classList.add('hidden');
                break
        }
    }

    function goToSection(i, anim) {
        gsap.to(window, {
            scrollTo: {y: i*innerHeight, autoKill: false},
            duration: 1
        });

        if(anim) {
            anim.restart();
        }
    }

    function updateSubscriber() {
        const { isValid, hasError, status } = subscriberState
        if (isValid) {
            subscriber.classList.remove('error')
            subscriber.classList.add('success')
        } else if (hasError) {
            subscriber.classList.remove('success')
            subscriber.classList.add('error')
        } else {
            subscriber.classList.remove('success')
            subscriber.classList.remove('error')
        }
        if (status) {
            subscriber.classList.add('subscribed')
        }
    }

    function toggleSubscriber() {
        if (subscriberState.isShown) {
            subscriberState = {
                ...subscriberState,
                isShown: false
            }
            subscriber.classList.add('hidden');
            notifyButton.classList.remove('hidden');
        } else {
            subscriberState = {
                ...subscriberState,
                isShown: true
            }
            subscriber.classList.remove('hidden');
            notifyButton.classList.add('hidden');
        }
    }

    const subscriberInput = document.getElementById('subscriber-input')
    function updateSubscriberInput() {
        const { status } = subscriberState
        subscriberInput.setAttribute('disabled', !!status)
    }

    function getSubscriberInputValue() {
        const { value = '' } = subscriberInput
        subscriberState = {
            ...subscriberState,
            value: value
        }
        return subscriberState.value
    }

    const subscriberButton = document.getElementById('subscriber-button')
    function updateSubscriberButton() {
        const { status } = subscriberState
        subscriberButton.setAttribute('disabled', !!status)
        document.getElementById('subscriber-button-text').innerHTML = 'Added'
        document.getElementById('subscriber-button-icon').innerHTML = '&check;'
    }

    const subscriberError = document.getElementById('subscriber-error')
    function updateSubscriberError() {
        subscriberError.innerHTML = subscriberState.errorMessage
    }

    const handleSubscribeSuccess = (status) => {
        subscriberState = {
            ...subscriberState,
            status,
            isValid: true,
            hasError: false,
            errorMessage: '',
        }
        updateSubscriber()
        updateSubscriberInput()
        updateSubscriberButton()
        updateSubscriberError()
        setTimeout(() => {
            toggleSubscriber()
            restoreSubsciberState()
        }, 1000)
    }

    const handleValidateSuccess = () => {
        subscriberState = {
            ...subscriberState,
            isValid: true,
            hasError: false,
            errorMessage: '',
        }
        updateSubscriber()
        updateSubscriberError()
    }

    const handleError = (message) => {
        subscriberState = {
            ...subscriberState,
            isValid: false,
            hasError: true,
            errorMessage: message,
        }
        updateSubscriber()
        updateSubscriberError()
    }

    const handleEmptyInput = () => {
        subscriberState = {
            ...subscriberState,
            isValid: false,
            hasError: false,
            errorMessage: '',
        }
        updateSubscriber()
        updateSubscriberError()
    }

    const handleSubscribe = (email) => {
        subscribe(email)
            .then(({ error, data = {} }) => {
                const { status } = data
                if (status === 'subscribed') {
                    handleSubscribeSuccess(status)
                }
                if (error) {
                    handleError(error)
                }
            })
    }

    const handleValidate = () => {
        const email = getSubscriberInputValue()

        if (!email) {
            handleEmptyInput()
            return false
        }
        if (validateEmail(email)) {
            handleValidateSuccess()
            return true
        } else {
            handleError('Please enter a valid email address')
            return false
        }
    }

    const handleNotifyClick = () => {
        const email = getSubscriberInputValue()

        if (!email) {
            handleError('Please enter an email address')
        } else if (handleValidate()) {
            handleSubscribe(email)
        }
    }

    const restoreSubsciberState = () => {
        subscriber.classList.remove('error')
        subscriber.classList.remove('success')
        subscriber.classList.remove('subscribed')
        subscriberButton.removeAttribute('disabled')
        subscriberInput.removeAttribute('disabled')
        subscriberInput.value = '';
        subscriberState = {
            status: undefined,
            value: '',
            isValid: false,
            hasError: false,
            errorMessage: '',
            messageDisplay: 'none',
            isShown: false,
            amount: 0
        }
        document.getElementById('subscriber-button-text').innerHTML = 'Sign Up'
        document.getElementById('subscriber-button-icon').innerHTML = '&rarr;'
    }

    gsap.registerPlugin(ScrollTrigger)

    ScrollTrigger.create({
        snap: 1 / 4
    })

    subscriber.classList.add('hidden')

    setSectionContent()

    arrowUp.addEventListener('click',() =>
        pageState.currentSection > 0 && goToSection(pageState.currentSection - 1))

    arrowDown.addEventListener('click', () =>
        pageState.currentSection < 2 && goToSection(pageState.currentSection + 1)
    )

    notifyButton.addEventListener('click', toggleSubscriber)

    window.addEventListener('scroll', setSectionContent)

    if (subscriberInput) {
        subscriberInput.addEventListener('blur', handleValidate)
    }
    if (subscriberButton) {
        subscriberButton.addEventListener('click', handleNotifyClick)
    }
})

window.addEventListener('load', () => {
    localStorage.clear();
    sessionStorage.clear();
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
