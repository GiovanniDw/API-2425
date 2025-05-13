import { $, $$ } from '~/utils.js'

const dialog = $('#create-room-dialog')
const showButton = $('#create-room')
const closeButton = $('#close-dialog')

// "Show the dialog" button opens the dialog modally
showButton.addEventListener('click', () => {
  dialog.showModal()
})

// "Close" button closes the dialog
closeButton.addEventListener('click', () => {
  dialog.close()
})
