import curdGenerator from './plop-template/curd/prompt.mjs'

export default (plop) => {
  plop.setGenerator('curd', curdGenerator)
}
