<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Event extends MX_Controller {

    function __construct() {
        parent::__construct();
        $this->load->library('Ion_auth');
        $this->load->library('session');
        $this->load->library('form_validation');
        $this->load->model('event_model');
        $this->load->model('area/area_model');
        $this->load->model('ion_auth_model');
        if (!$this->ion_auth->logged_in()) {
            redirect('auth/login', 'refresh');
        }
        if (!$this->ion_auth->in_group(array('admin', 'Nurse', 'Accountant', 'Volunteer', 'Laboratorist'))) {
            redirect('home/permission');
        }
    }

    public function index() {
        $data['events'] = $this->event_model->getEvent();
        $data['areas'] = $this->area_model->getArea();
        $this->load->view('home/dashboard'); // just the header file
        $this->load->view('event', $data);
        $this->load->view('home/footer'); // just the header file
    }

    public function addNewView() {
        $data = array();
        $data['areas'] = $this->area_model->getArea();
        $this->load->view('home/dashboard'); // just the header file
        $this->load->view('add_new', $data);
        $this->load->view('home/footer'); // just the header file
    }

    public function addNew() {
        $id = $this->input->post('id');
        $organiser = $this->input->post('organiser');
        $location = $this->input->post('location');
        $contact = $this->input->post('contact');
        $date = $this->input->post('date');
        $subject = $this->input->post('subject');
        $description = $this->input->post('description');
        $guests = $this->input->post('guests');
        $event_id = $this->input->post('p_id');
        if (empty($event_id)) {
            $event_id = rand(10000, 1000000);
        }


        $this->load->library('form_validation');
        $this->form_validation->set_error_delimiters('<div class="error">', '</div>');

        // Validating Name Field
        $this->form_validation->set_rules('organiser', 'Organiser', 'trim|required|min_length[5]|max_length[100]|xss_clean');
        // Validating Email Field
        $this->form_validation->set_rules('location', 'Location', 'trim|required|min_length[5]|max_length[100]|xss_clean');
        // Validating Volunteer Field
        $this->form_validation->set_rules('contact', 'Contact', 'trim|min_length[5]|max_length[100]|xss_clean');
        // Validating Name Field
        $this->form_validation->set_rules('date', 'Date', 'trim|required|min_length[5]|max_length[100]|xss_clean');
        // Validating Email Field
        $this->form_validation->set_rules('subject', 'Subject', 'trim|min_length[3]|max_length[100]|xss_clean');
        // Validating Volunteer Field
        $this->form_validation->set_rules('description', 'Description', 'trim|min_length[3]|max_length[100]|xss_clean');
        // Validating Address Field   
        $this->form_validation->set_rules('guests', 'Guests', 'trim|min_length[3]|max_length[500]|xss_clean');
        // Validating Phone Field          

        if ($this->form_validation->run() == FALSE) {
            if (!empty($id)) {
                redirect("event/editEvent?id=$id");
            } else {
                $data = array();
                $data['areas'] = $this->area_model->getArea();
                $this->load->view('home/dashboard'); // just the header file
                $this->load->view('add_new', $data);
                $this->load->view('home/footer'); // just the header file
            }
        } else {

            $data = array();
            $data = array(
                'event_id' => $event_id,
                'organiser' => $organiser,
                'location' => $location,
                'contact' => $contact,
                'date' => $date,
                'subject' => $subject,
                'description' => $description,
                'guests' => $guests,
            );
            if (empty($id)) {     // Adding New Event
                $this->event_model->insertEvent($data);
                $this->session->set_flashdata('feedback', 'Event Added');
                redirect('event');
            } else { // Updating Event
                $this->event_model->updateEvent($id, $data);
                $this->session->set_flashdata('feedback', 'Updated');
                redirect('event');
            }
        }
    }

    function getEvent() {
        $data['event'] = $this->event_model->getEvent();
        $this->load->view('event', $data);
    }

    function editEvent() {
        $data = array();
        $id = $this->input->get('id');
        $data['event'] = $this->event_model->getEventById($id);
        $data['areas'] = $this->area_model->getArea();
        $this->load->view('home/dashboard'); // just the header file
        $this->load->view('add_new', $data);
        $this->load->view('home/footer'); // just the footer file
    }

    function editEventByJason() {
        $id = $this->input->get('id');
        $data['event'] = $this->event_model->getEventById($id);
        echo json_encode($data);
    }

    function eventDetails() {
        $data = array();
        $id = $this->input->get('id');
        $data['event'] = $this->event_model->getEventById($id);
        $this->load->view('home/dashboard'); // just the header file
        $this->load->view('details', $data);
        $this->load->view('home/footer'); // just the footer file
    }

    function delete() {
        $data = array();
        $id = $this->input->get('id');
        $this->event_model->delete($id);
        $this->session->set_flashdata('feedback', 'Deleted');
        redirect('event');
    }

}

/* End of file event.php */
/* Location: ./application/modules/event/controllers/event.php */
