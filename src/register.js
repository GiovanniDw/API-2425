// import {$, $$} from '~/utils.js'


// const registerForm = $('#register-form')

// console.log('registerForm')

// const registerError = $('#register-error')

// const emailInput = $('#username')
// const passwordInput = $('#password')

// const nameInput = $('#name')

// registerForm.addEventListener('submit', async (e) => {
//   e.preventDefault()

//   nameInput.value
//   emailInput.value
//   passwordInput.value
//   if (emailInput.value) {
//     console.log(emailInput.value)

//     let user = {
//       name: nameInput.value,
//       username: emailInput.value,
//       password: passwordInput.value,
//     }
//     console.log(user)

//     try {
//       let { username, name, password } = user
//       console.log(user)
//       const res = await fetch('http://localhost:3000/register', {
//         method: 'POST',
//         body: user,
//         headers: { 'Content-Type': 'application/json' },
//       })
//       const data = await res.json()

      
//       console.log('data')
//       console.log(data)
//       console.log(data.user)
//       if (data.errors) {
//         registerError.innerHTML = /*html*/ `
//           <p>${data.errors.email}</p>
//           <p>${data.errors.username}</p>
//           <p>${data.errors.password}</p>
//           `
//       }
//       if (data.user) {
//         // this.state.setAuth(isLoggedIn)
//         // setState({ user: data.user, isLoggedIn: true })
        
//         registerError.innerHTML = /*html*/ `
//             <p>Welcome ${user.name}</p>
//             `

//         // hide register modal after register
//         setTimeout(() => {
//           // this.state.toggleLogin(false);
//           console.log('timeout')
//         }, 500)
//       }
//     } catch (error) {
//       console.error(error)
//     }
//   }
// })
