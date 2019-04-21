import React, { Component } from 'react';
import axios from 'axios'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from 'reactstrap';
import Swal from 'sweetalert2';
axios.defaults.baseURL = 'http://localhost:3333/api/v1'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      employees: [],
      filteredData: [],
      modal: false,
      query: '',
      access_code: '',
      selectedEmpl: '',
      isValid: false
    }
    this.newPresence = this.newPresence.bind(this)
    this.toggle = this.toggle.bind(this);   
    this.handleChange = this.handleChange.bind(this);   
    this.handleSubmit = this.handleSubmit.bind(this);   
  }
  
  newPresence(emp) {
    this.toggle()
    console.log(emp.access_code)
    this.setState({ selectedEmpl: emp})
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
      isValid: false
    }));
  }

  isArrival() {
    var d = new Date(); // current time
    console.log(d)
    var hours = d.getHours();
    var mins = d.getMinutes();
    var day = d.getDay();
    console.log('hours -> ', hours, 'mins -> ', mins, 'day -> ', day)
    return (day >= 0 && day <= 6) && (hours >= 7 && mins <= 30);
  }

  handleChange(event) {
    // console.log(event.target.value)
    if (event.target.name === 'access_code') {
      this.setState({ access_code: event.target.value }) 
      if (this.state.selectedEmpl.access_code === event.target.value) {
        this.setState({ isValid: true })
      }else{
        this.setState({ isValid: false })
      }
    }
  }

  handleUserInput(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(){
    //LOADING
    Swal.fire({
      onOpen: function () {
        Swal.showLoading()
      }
    })

    const typePresence = this.isArrival() ? 'arrival': 'departure';

    axios.post(`/employees/${this.state.selectedEmpl.id}/presence?code=${this.state.access_code}&type=${typePresence}`).then(res=>{
      console.log(res.data)
      // END MODAL
      this.setState({ modal: false })
      Swal.hideLoading();
      axios.get('/employees').then(res => {
        //   console.log(res.data)
        this.setState({ employees: res.data })
      }).catch(error => {
        console.log(error.message)
      })
      Swal.fire({
        type: "success"
      });      
    }).catch(error => {
      // END MODAL
      this.setState({ modal: false })
      Swal.hideLoading();
      Swal.fire({
        text: "Une erreur s'est produite !",
        type: "error"
      });
      console.log(error.response)
    })
  }

  componentDidMount = () => {
    axios.get('/employees').then(res => {
      //   console.log(res.data)
      this.setState({ employees: res.data })
    }).catch(error => {
      console.log(error.message)
    })
  };
  render() {
    return (
      <div>
        <section id="subscribe">
          <div className="container">
              <form method="POST" action="#">
                  <div className="form-row justify-content-center">
                      <div className="col-auto">
                          <input type="text" className="form-control" placeholder="Rechercher un employé" />
                      </div>
                      <div className="col-auto">
                          <button type="submit">Rechercher</button>
                      </div>
                  </div>
              </form>
          </div>
        </section>
        <div className="container">
          <div className="col-lg-12" id="buy-tickets">
            <div className="card mb-5 mb-lg-0">
              <div className="card-body">
                <h5 className="card-title text-muted text-uppercase text-center">Liste de présence</h5>
                <hr />
                <ul className="fa-ul">
                  {
                    this.state.employees ? this.state.employees.map(e => (
                      <li key={e.id} onClick={() => this.newPresence(e)} style={{ cursor: 'pointer' }}>
                        <span className="fa-li">
                          {
                            e.presences.length === 0 ? 
                              <i className="fa fa-times text-danger"></i> : 
                            e.presences.length === 1 ?
                              <i className="fa fa-check text-success"></i> :
                              <i className="fas fa-check-double text-success"></i> 
                          }
                          {/* <i className="fas fa-check-double text-success"></i> */}
                        </span>
                        { e.lastname } { e.firstname }
                      </li>
                    )
                    ) : <h4>Loading...</h4>                    
                  }
                  {/* <li><span className="fa-li"><i className="fa fa-check"></i></span>Regular Seating</li>
                  <li><span className="fa-li"><i className="fa fa-check"></i></span>Coffee Break</li>
                  <li><span className="fa-li"><i className="fa fa-check"></i></span>Custom Badge</li>
                  <li><span className="fa-li"><i className="fa fa-check"></i></span>Community Access</li>
                  <li className="text-muted"><span className="fa-li"><i className="fa fa-times"></i></span>Workshop Access</li>
                  <li className="text-muted"><span className="fa-li"><i className="fa fa-times"></i></span>After Party</li> */}
                </ul>
                <hr />
                <div className="text-center">
                  <button type="button" className="btn">Fermer</button>
                </div>
              </div>
            </div>
          </div>   
        </div>     
        {/* Modal */}
        <Modal isOpen={this.state.modal} centered toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Entrer votre matricule</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Input 
                type="password" 
                name="access_code" 
                id="matricule" 
                placeholder="********" 
                onChange={this.handleChange}
                valid={this.state.isValid}
                invalid={!this.state.isValid && this.state.access_code.length > 0} 
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.toggle}>Annuler</Button>
            <Button color="primary" onClick={this.handleSubmit} disabled={!this.state.isValid}>Valider</Button>{' '}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default App;
