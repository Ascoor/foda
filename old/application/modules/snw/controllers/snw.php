<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Snw extends MX_Controller {

    function __construct() {
        parent::__construct();
        $this->load->library('Ion_auth');
        $this->load->library('session');
        $this->load->library('form_validation');
        $this->load->model('snw_model');
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
        $data['snws'] = $this->snw_model->getSnw();
        $this->load->view('home/dashboard'); // just the header file
        $this->load->view('snw', $data);
        $this->load->view('home/footer'); // just the header file
    }

    public function addNewView() {
        $data = array();
        $data['areas'] = $this->area_model->getArea();
        $data['groups'] = $this->donor_model->getBloodBank();
        $this->load->view('home/dashboard'); // just the header file
        $this->load->view('add_new', $data);
        $this->load->view('home/footer'); // just the header file
    }

    public function addNew() {
        $id = $this->input->post('id');
        $type = $this->input->post('type');
        $topic = $this->input->post('topic');
        $note = $this->input->post('note');

        $this->load->library('form_validation');
        $this->form_validation->set_error_delimiters('<div class="error">', '</div>');

        // Validating Type Field
        $this->form_validation->set_rules('type', 'Type', 'trim|min_length[1]|max_length[100]|xss_clean');
        // Validating Password Field
        $this->form_validation->set_rules('topic', 'Topic', 'trim|required|min_length[5]|max_length[100]|xss_clean');
        // Validating Note Field
        $this->form_validation->set_rules('note', 'Note', 'trim|required|min_length[5]|max_length[100]|xss_clean');

        if ($this->form_validation->run() == FALSE) {
            if (!empty($id)) {
                redirect("snw/editSnw?id=$id");
            } else {
                $data = array();
                $data['areas'] = $this->area_model->getArea();
                $data['typeOfAnalysis'] = $type;
                $this->load->view('home/dashboard'); // just the header file
                $this->load->view('add_new', $data);
                $this->load->view('home/footer'); // just the header file
            }
        } else {
            $data = array();
            $data = array(
                'type' => $type,
                'topic' => $topic,
                'note' => $note,
            );
            if (empty($id)) {     // Adding New Snw
                $this->snw_model->insertSnw($data);
                if($type == 1){
                $this->session->set_flashdata('feedback', 'Strength Added');
                }
                elseif($type == 2){
                    $this->session->set_flashdata('feedback', 'Weakness Added');
                }
                elseif($type == 3){
                    $this->session->set_flashdata('feedback', 'Opportunity Added');
                }
                else{
                    $this->session->set_flashdata('feedback', 'Threat Added');
                }
                
            } else { // Updating Snw
                $this->snw_model->updateSnw($id, $data);
                $this->session->set_flashdata('feedback', 'Updated');
            }
            // Loading View
            redirect('snw');
        }
    }

    function getSnw() {
        $data['snw'] = $this->snw_model->getSnwr();
        $this->load->view('snw', $data);
    }

    function editSnw() {
        $data = array();
        $id = $this->input->get('id');
        $data['snw'] = $this->snw_model->getSnwById($id);
        $data['areas'] = $this->area_model->getArea();
        $this->load->view('home/dashboard'); // just the header file
        $this->load->view('add_new', $data);
        $this->load->view('home/footer'); // just the footer file
    }

    function editSnwByJason() {
        $id = $this->input->get('id');
        $data['snw'] = $this->snw_model->getSnwById($id);
        echo json_encode($data);
    }

    function snwDetails() {
        $data = array();
        $id = $this->input->get('id');
        $data['snw'] = $this->snw_model->getSnwById($id);
        $this->load->view('home/dashboard'); // just the header file
        $this->load->view('details', $data);
        $this->load->view('home/footer'); // just the footer file
    }

    function delete() {
        $id = $this->input->get('id');
        $this->snw_model->delete($id);
        redirect('snw');
    }
}

/* End of file snw.php */
/* Location: ./application/modules/snw/controllers/snw.php */
