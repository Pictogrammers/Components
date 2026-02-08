export default {
  title: 'Pictogrammers Components',
  logo: 'src/logo.svg',
  navigation: [{
    label: 'Components',
  }, {
    label: 'Overlays',
    extends: ['PgOverlay'],
    include: ['PgOverlay'],
  }, {
    label: 'Modals',
    extends: ['PgModal'],
    include: ['PgModal', 'PgModalAlert', 'PgModalConfirm'],
  }],
  themes: [{
    label: 'UI3',
    file: 'src/theme-ui3.css',
  }],
  repo: 'https://github.com/Pictogrammers/Components',
  repoComponent: '$repo/tree/master/src/components/$namespace/$component'
}
