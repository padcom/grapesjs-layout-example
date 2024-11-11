import grapesjs from 'grapesjs'

/**
 * @param {import("grapesjs").Editor} editor
 */
function example(editor) {
  function addLayoutElement(type, tagName, autoExpandable, color) {
    editor.Components.addType(`main-layout-${type}`, {
      view: {
        renderAttributes() {
          if (autoExpandable) this.$el[0].classList.add('gjs-auto-expandable')
        }
      },
      model: {
        defaults: {
          tagName,
          styles: `
            .${type} {
              grid-area: ${type};
              background-color: ${color};
            }
          `,
          classes: [type],
          droppable: true,
          removable: false,
          copyable: false,
          draggable: false,
        },
      },
    })
  }

  addLayoutElement('header', 'header', true, 'pink')
  addLayoutElement('navigation', 'nav', true, 'yellow')
  addLayoutElement('content', 'main', true, 'white')
  addLayoutElement('footer', 'footer', true, 'orange')

  editor.Components.addType('main-layout', {
    block: {
      label: 'main-layout',
      select: true,
    },
    model: {
      defaults: {
        classes: ['main-layout'],
        styles: `
          .main-layout {
            display: grid;
            height: 100dvh;
            grid-template-areas:
              "header header"
              "navigation content"
              "footer footer";
            grid-template-columns: max-content 1fr;
            grid-template-rows: min-content 1fr min-content;
          }
          .nav-right {
            grid-template-areas:
              "header header"
              "content navigation"
              "footer footer";
            grid-template-columns: 1fr max-content;
          }
        `,
        components: [
          { type: 'main-layout-header' },
          { type: 'main-layout-navigation' },
          { type: 'main-layout-content' },
          { type: 'main-layout-footer' },
        ],
        droppable: false,
        draggable: ['[data-gjs-type="wrapper"]'],
        traits: [
          {
            name: 'navbar-position',
            type: 'select',
            options: [{ id: 'left' }, { id: 'right' }],
            getValue({ component }) {
              if (component.getClasses().includes('nav-right')) {
                return 'right'
              } else {
                return 'left'
              }
            },
            setValue({ component, value }) {
              if (value === 'right') {
                component.addClass('nav-right')
              } else {
                component.removeClass('nav-right')
              }
            },
          },
        ],
      },
    },
  })

  editor.I18n.addMessages({
    'en': {
      'blockManager.labels.main-layout': 'Main layout',
      'domComponents.names.main-layout': 'Main layout',
      'domComponents.names.main-layout-header': 'Header',
      'domComponents.names.main-layout-navigation': 'Navigation',
      'domComponents.names.main-layout-content': 'Content',
      'domComponents.names.main-layout-footer': 'Footer',
      'traitManager.traits.labels.navbar-position': 'Navbar',
      'traitManager.traits.options.navbar-position.left': 'Left',
      'traitManager.traits.options.navbar-position.right': 'Right',
    },
  })

  editor.on('component:drag:start', () => {
    editor.Canvas.getBody().classList.add('gjs-drag-component')
  })
  editor.on('component:drag:end', () => {
    editor.Canvas.getBody().classList.remove('gjs-drag-component')
  })
  editor.on('canvas:dragenter', () => {
    editor.Canvas.getBody().classList.add('gjs-drag-canvas')
  })
  editor.on('canvas:dragend', () => {
    editor.Canvas.getBody().classList.remove('gjs-drag-canvas')
  })
  editor.Css.addRules(`
    .gjs-drag-component .gjs-auto-expandable,
    .gjs-drag-canvas .gjs-auto-expandable {
      min-height: 48px;
      min-width: 48px;
    }
  `)

  editor.Blocks.add('test', {
    label: 'Test',
    select: true,
    content: '<div>Hello, world!</div>',
  })
}

/**
 * @param {import("grapesjs").Editor} editor
 */
function showProjectData(editor) {
  // console.log(editor.Panels.getPanels().map(panel => panel.id))
  editor.Panels.addButton('options', {
    label: '!',
    command() {
      editor.Modal.open({
        title: 'Project data',
        content: `
          <pre style="max-height: 50vh; overflow: auto; color: #eee;">${
            JSON.stringify(editor.getProjectData(), null, 2)
          }</pre>
        `,
      })
    }
  })
}

grapesjs.init({
  container: '#gjs',
  height: '100vh',
  storageManager: false,
  plugins: [
    example,
    showProjectData,
    // 'grapesjs-preset-webpage',
  ],
  i18n: {
    // debug: true,
  },
})
