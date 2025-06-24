import { $, $$ } from '~/utils.js'

const mainNav = $('.main-nav')

const dialog = $('#create-room-dialog')
const showButton = $('#create-room-button')
const closeButton = $('#close-dialog')
const cancelDialogButton = $('#cancel')

// "Show the dialog" button opens the dialog modally
showButton.addEventListener('click', () => {
  dialog.showModal()
})

// "Close" button closes the dialog
closeButton.addEventListener('click', () => {
  dialog.close()
})

cancelDialogButton.addEventListener('click', () => {
  dialog.close()
})

if (window.location.pathname.startsWith('/chat/')) {
  mainNav.classList.add('hidden')
}
