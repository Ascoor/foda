<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Voter extends MX_Controller {

    function __construct() {
        parent::__construct();
        $this->load->library('Ion_auth');
        $this->load->library('session');
        $this->load->library('form_validation');
        $this->load->model('voter_model');
        $this->load->library('upload');
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
        $data['voters'] = $this->voter_model->getVoter();
        $data['groups'] = $this->voter_model->getBloodBank();
        $data['areas'] = $this->area_model->getArea();
        $this->load->view('home/dashboard'); // just the header file
        $this->load->view('voter', $data);
        $this->load->view('home/footer'); // just the header file
    }

    public function addNewView() {
        $data = array();
        $data['areas'] = $this->area_model->getArea();
        $data['groups'] = $this->voter_model->getBloodBank();
        $this->load->view('home/dashboard'); // just the header file
        $this->load->view('add_new', $data);
        $this->load->view('home/footer'); // just the header file
    }

    public function addNew() {
        $id = $this->input->post('id');
        $voter_id = $this->input->post('voter_id');
        $name = $this->input->post('name');
        $password = '&£%$^£HJJDG';
        $email = $this->input->post('email');
        $area = $this->input->post('area');
        $address = $this->input->post('address');
        $phone = $this->input->post('phone');
        $sex = $this->input->post('sex');
        $birthdate = $this->input->post('birthdate');
        $bloodgroup = $this->input->post('bloodgroup');
        if ((empty($id))) {
            $add_date = date('m/d/y');
        } else {
            $add_date = $this->db->get_where('voter', array('id' => $id))->row()->add_date;
        }

        $this->load->library('form_validation');
        $this->form_validation->set_error_delimiters('<div class="error">', '</div>');
        
        // Validating Voter ID Field
        $this->form_validation->set_rules('voter_id', 'Voter Id', 'trim|required|min_length[1]|max_length[100]|xss_clean');
        // Validating Name Field
        $this->form_validation->set_rules('name', 'Name', 'trim|required|min_length[3]|max_length[100]|xss_clean');
        // Validating Email Field
        $this->form_validation->set_rules('email', 'Email', 'trim|required|min_length[3]|max_length[100]|xss_clean');
        // Validating Area Field
        $this->form_validation->set_rules('area', 'Area', 'trim|min_length[1]|max_length[100]|xss_clean');
        // Validating Address Field   
        $this->form_validation->set_rules('address', 'Address', 'trim|required|min_length[5]|max_length[500]|xss_clean');
        // Validating Phone Field           
        $this->form_validation->set_rules('phone', 'Phone', 'trim|required|min_length[5]|max_length[50]|xss_clean');
        // Validating Birthdate Field   
        $this->form_validation->set_rules('birthdate', 'Birth Date', 'trim|required|min_length[5]|max_length[500]|xss_clean');
        // Validating Blood Group Field           
        $this->form_validation->set_rules('bloodgroup', 'Blood Group', 'trim|min_length[1]|max_length[10]|xss_clean');

        if ($this->form_validation->run() == FALSE) {
            if (!empty($id)) {
                redirect("voter/editVoter?id=$id");
            } else {
                $data = array();
                $data['areas'] = $this->area_model->getArea();
                $data['groups'] = $this->voter_model->getBloodBank();
                $this->load->view('home/dashboard'); // just the header file
                $this->load->view('add_new', $data);
                $this->load->view('home/footer'); // just the header file
            }
        } else {
            $file_name = $_FILES['img_url']['name'];
            $file_name_pieces = split('_', $file_name);
            $new_file_name = '';
            $count = 1;
            foreach ($file_name_pieces as $piece) {
                if ($count !== 1) {
                    $piece = ucfirst($piece);
                }

                $new_file_name .= $piece;
                $count++;
            }
            $config = array(
                'file_name' => $new_file_name,
                'upload_path' => "./uploads/",
                'allowed_types' => "gif|jpg|png|jpeg|pdf",
                'overwrite' => False,
                'max_size' => "20480000", // Can be set to particular file size , here it is 2 MB(2048 Kb)
                'max_height' => "1768",
                'max_width' => "2024"
            );

            $this->load->library('Upload', $config);
            $this->upload->initialize($config);

            if ($this->upload->do_upload('img_url')) {
                $path = $this->upload->data();
                $img_url = "uploads/" . $path['file_name'];
                $data = array();
                $data = array(
                    'voter_id' => $voter_id,
                    'img_url' => $img_url,
                    'name' => $name,
                    'email' => $email,
                    'address' => $address,
                    'area' => $area,
                    'phone' => $phone,
                    'birthdate' => $birthdate,
                    'bloodgroup' => $bloodgroup,
                    'add_date' => $add_date
                );
            } else {
                //$error = array('error' => $this->upload->display_errors());
                $data = array();
                $data = array(
                    'voter_id' => $voter_id,
                    'name' => $name,
                    'email' => $email,
                    'area' => $area,
                    'address' => $address,
                    'phone' => $phone,
                    'birthdate' => $birthdate,
                    'bloodgroup' => $bloodgroup,
                    'add_date' => $add_date
                );
            }

            $username = $this->input->post('name');

            if (empty($id)) {     // Adding New Voter
                if ($this->ion_auth->email_check($email)) {
                    $this->session->set_flashdata('feedback', 'This Email Address Is Already Registered');
                    redirect('voter/addNewView');
                } else {
                    $dfg = 5;
                    $this->ion_auth->register($username, $password, $email, $dfg);
                    $user_id = $this->db->insert_id();
                    $ion_user_id = $this->db->get_where('users_groups', array('id' => $user_id))->row()->user_id;
                    $this->voter_model->insertVoter($data);
                    $voter_user_id = $this->db->insert_id();
                    $id_info = array('ion_user_id' => $ion_user_id);
                    $this->voter_model->updateVoter($voter_user_id, $id_info);
                    $this->session->set_flashdata('feedback', 'Added');
                    redirect('voter');
                }
            } else { // Updating Voter
                $ion_user_id = $this->db->get_where('voter', array('id' => $id))->row()->ion_user_id;
                if (empty($password)) {
                    $password = $this->db->get_where('users', array('id' => $ion_user_id))->row()->password;
                } else {
                    $password = $this->ion_auth_model->hash_password($password);
                }
                $this->voter_model->updateIonUser($username, $email, $password, $ion_user_id);
                $this->voter_model->updateVoter($id, $data);
                $this->session->set_flashdata('feedback', 'Updated');
                redirect('voter');
            }
            // Loading View
        }
    }

    function getVoter() {
        $data['voter'] = $this->voter_model->getVoter();
        $this->load->view('voter', $data);
    }

    function editVoter() {
        $data = array();
        $id = $this->input->get('id');
        $data['voter'] = $this->voter_model->getVoterById($id);
        $data['areas'] = $this->area_model->getArea();
        $data['groups'] = $this->voter_model->getBloodBank();
        $this->load->view('home/dashboard'); // just the header file
        $this->load->view('add_new', $data);
        $this->load->view('home/footer'); // just the footer file
    }

    function editVoterByJason() {
        $id = $this->input->get('id');
        $data['voter'] = $this->voter_model->getVoterById($id);
        echo json_encode($data);
    }

    function voterDetails() {
        $data = array();
        $id = $this->input->get('id');
        $data['voter'] = $this->voter_model->getVoterById($id);
        $this->load->view('home/dashboard'); // just the header file
        $this->load->view('details', $data);
        $this->load->view('home/footer'); // just the footer file
    }

    function delete() {
        $data = array();
        $id = $this->input->get('id');
        $user_data = $this->db->get_where('voter', array('id' => $id))->row();
        $path = $user_data->img_url;

        if (!empty($path)) {
            unlink($path);
        }
        $ion_user_id = $user_data->ion_user_id;
        $this->db->where('id', $ion_user_id);
        $this->db->delete('users');
        $this->voter_model->delete($id);
        redirect('voter');
    }

}

/* End of file voter.php */
/* Location: ./application/modules/voter/controllers/voter.php */
