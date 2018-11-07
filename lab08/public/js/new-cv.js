// JQuery-like selector
window.$ = function(selector) {
  return document.querySelector(selector)
}
// JQuery-like selector
window.$all = function(selector) {
  return document.querySelectorAll(selector)
}
// Callback to run when document content is loaded
window.onready = function(callback) {
  document.addEventListener('DOMContentLoaded', callback)
}
// Return an object containing data-* atribute element
function getElementDataAttr(element) {
  return element ? element.dataset : {}
}
// Execute a command to edit
function doCommand(opt) {
  let value = ''
  if (opt.hasValue) {
    value = window.prompt('Digite o valor:', 'http://exemplo.com')
  }
  const result = document.execCommand(opt.cmd, false, value)
  console.log(result ? `Comando ${opt.cmd} executado` : `Falha ao executar ${opt.cmd}`)
}
onready(function() {
  const secItemTamplate = function() {
    const secItemId = Date.now()
    return `
      <div class="section-item-container section" id="sec-item-${secItemId}">
        <p class="section-subtitle" contenteditable="true">Subtítulo</p>
        <p class="section-description" contenteditable="true" spellcheck="false">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore impedit mollitia quas laudantium. 
        Tenetur omnis esse unde quis incidunt eos, eaque at, consectetur quidem animi in odio eum dolor ab!
        </p>
        <div class="create-sec-item float-btn" data-action="create" data-secid="sec-item-${secItemId}">
          <i class="fa fa-plus" data-action="create" data-secid="sec-item-${secItemId}"></i>
        </div>
        <div class="remove-sec-item float-btn" data-action="remove" data-secid="sec-item-${secItemId}">
          <i class="fa fa-minus" data-action="remove" data-secid="sec-item-${secItemId}"></i>
        </div>
      </div>`
  }

  const sectionTemplate = function() {
    const secId = Date.now()
    return `
    <li id="sec-${secId}" class="sections">
      <div class="sec-head">
        <p class="section-title" contenteditable="true">Título da secção</p>
        <span class="remove-sec float-btn" data-action="remove" data-secid="sec-${secId}">
          <i class="fa fa-minus" data-action="remove" data-secid="sec-${secId}"></i>
        </span>
      </div>
      ${secItemTamplate()}
    </li>`
  }
  // Defina actions to create and remove sections items
  function sectionActions(event) {
    let action = event.target.dataset.action
    let secid = event.target.dataset.secid
    const el = $(`#${secid}`)
    switch (action) {
      case 'create':
        el.insertAdjacentHTML('afterend', secItemTamplate())
        break
      case 'remove':
        el.remove()
      default:
        break
    }
    console.log(action)
  }

  function newSection(event) {
    $('#sec-container').insertAdjacentHTML('beforeend', sectionTemplate())
  }

  function selectColor(event) {
    document.documentElement.style.setProperty('--primary-color', event.target.value)
  }

  function createLink(event) {
    event.preventDefault()
    doCommand({ cmd: 'createlink', hasValue: true })
  }

  function unLink(event) {
    event.preventDefault()
    doCommand({ cmd: 'unlink' })
  }

  function insertImg(event) {
    event.preventDefault()
    doCommand({ cmd: 'insertimage', hasValue: true })
  }

  function createUl(event) {
    event.preventDefault()
    doCommand({ cmd: 'insertUnorderedList' })
  }

  function createOl(event) {
    event.preventDefault()
    doCommand({ cmd: 'insertOrderedList' })
  }

  function toJSON(res) {
    return res.json()
  }

  function saveCv(event) {
    const cvNode = $('#paper-cv')
    let cvHtml = cvNode.innerHTML.replace(new RegExp(`contenteditable="true"`, 'g'), '')
    window
      .fetch('/cv/new', {
        method: 'post',
        body: JSON.stringify({ cv: cvHtml }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
      })
      .then(toJSON)
      .then(function(data) {
        console.log('Saving cv...', data)
      })
      .catch(function(err) {
        console.log('Erro to save cv:', err)
      })
  }
  // Add actions buttos to create/remove section items
  $('#sec-container').onclick = sectionActions

  // Toolbar ->>
  $('#menu-tool-bar').onmousedown = function(e) {
    e.preventDefault()
  } // Needed to not lose focus
  // Create a whole new section
  $('#new-section').onclick = newSection
  // Change CSS variables
  $('#color-picker').onchange = selectColor
  // create a link
  $('#create-link').onclick = createLink
  // unlink
  $('#remove-link').onclick = unLink
  // insert image
  $('#insert-img').onclick = insertImg
  // unordered list
  $('#sub-section-ul').onclick = createUl
  // ordered list
  $('#sub-section-ol').onclick = createOl
  // save cv
  $('#save-cv').onclick = saveCv
})
