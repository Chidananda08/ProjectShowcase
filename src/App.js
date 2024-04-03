import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectShowCase from './components/ProjectShowCase'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apStatus = {
  initial: 'initial',
  loading: 'loading',
  success: 'success',
  fail: 'fail',
}

class App extends Component {
  state = {data: [], ap: apStatus.initial, sel: 'ALL'}

  componentDidMount() {
    this.getData()
  }

  async getData() {
    this.setState({ap: apStatus.loading})
    const {sel} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${sel}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const updateData = data.projects.map(i => ({
        id: i.id,
        name: i.name,
        imageUrl: i.image_url,
      }))
      this.setState({data: updateData, ap: apStatus.success})
    } else {
      this.setState({ap: apStatus.fail})
    }
  }

  handleSelectChange = event => {
    this.setState({sel: event.target.value}, this.getData)
  }

  loadingView = () => (
    <div data-testid="loader" className="load">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  successView = () => {
    const {data} = this.state
    return (
      <div className="q-con">
        <ul className="app-con">
          {data.map(j => (
            <ProjectShowCase details={j} key={j.id} />
          ))}
        </ul>
      </div>
    )
  }

  failureView = () => (
    <div className="fail-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="ima"
      />
      <h1 className="header">Oops! Something Went Wrong</h1>
      <p className="para">
        We cannot seem to find the page you are looking for
      </p>
      <button className="but" type="button" onClick={this.getData}>
        Retry
      </button>
    </div>
  )

  render() {
    const {sel, ap} = this.state
    let view
    switch (ap) {
      case apStatus.loading:
        view = this.loadingView()
        break
      case apStatus.success:
        view = this.successView()
        break
      case apStatus.fail:
        view = this.failureView()
        break
      default:
        view = null
    }

    return (
      <div>
        <nav className="nav-el">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="web"
          />
        </nav>
        <div className="main-con">
          <ul className="sel-con">
            <select
              className="sel"
              value={sel}
              onChange={this.handleSelectChange}
            >
              {categoriesList.map(each => (
                <option value={each.id} key={each.id}>
                  {each.displayText}
                </option>
              ))}
            </select>
          </ul>
          {view}
        </div>
      </div>
    )
  }
}

export default App
