if ('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
    console.log('register');
  })
} else {
  console.log('not registered')
}