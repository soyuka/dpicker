<script type="text/javascript">
  var main = document.getElementById('main')
  var iframe = document.getElementById('demo-iframe')
  var container = main.parentNode

  if (!iframe) {
    var iframe = document.createElement('iframe')
    iframe.setAttribute('frameBorder', 0)
    iframe.setAttribute('width', '99%')
    iframe.setAttribute('id', 'demo-iframe')
    iframe.setAttribute('height', '100%')
    iframe.setAttribute('src', 'https://soyuka.github.io/dpicker/demo/public/index.html')

    container.appendChild(iframe)
  }

  function init() {
    main.style.display = 'none'
    iframe.style.display = 'block'
  }

  function reset() {
    main.style.display = 'block'
    iframe.style.display = 'none'
  }

  setTimeout(function() {
    init()
  }, 100)

  window.addEventListener('hashchange', function() {
    if (~location.hash.indexOf('_demo')) {
      init()
    } else {
      reset()
    }
  })
</script>
