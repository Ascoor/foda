<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Team extends MX_Controller {

    function __construct() {
        parent::__construct();
        $this->load->library('Ion_auth');
        $this->load->library('session');
        $this->load->library('form_validation');
        $this->load->model('area/area_model');
        $this->load->model('team_model');
        $this->load->model('volunteer/volunteer_model');
        $this->load->model('ion_auth_model');
        if (!$this->ion_auth->logged_in()) {
            redirect('auth/login', 'refresh');
        }
        if (!$this->ion_auth->in_group('admin')) {
            redirect('home/permission');
        }
    }

    public function index() {
        $data['areas'] = $this->area_model->getArea();
        $data['volunteers'] = $this->volunteer_model->getVolunteer();
        $data['teams'] = $this->team_model->getTeam();
        $this->load->view('home/dashboard'); // just the header file
        $this->load->view('team', $data);
        $this->load->view('home/footer'); // just the header file
    }

    public function addNewView() {
        $data['areas'] = $this->area_model->getArea();
        $data['volunteers'] = $this->volunteer_model->getVolunteer();
        $this->load->view('home/dashboard'); // just the header file
        $this->load->view('add_new', $data);
        $this->load->view('home/footer'); // just the header file
    }

    public function addNew() {
        $id = $this->input->post('id');
        $name = $this->input->post('name');
        $area = $this->input->post('area');
        $members = $this->input->post('members');
        if (!empty($members)) {
            $members = implode(',', $this->input->post('members'));
        } else {
            $members = ' ';
        }
        $task = $this->input->post('task');
        $this->load->library('form_validation');
        $this->form_validation->set_error_delimiters('<div class="error">', '</div>');
        // Validating Name Field
        $this->form_validation->set_rules('name', 'Name', 'trim|required|min_length[5]|max_length[100]|xss_clean');
        // Validating Area Field
        $this->form_validation->set_rules('area', 'Area', 'trim|min_length[1]|max_length[1000]|xss_clean');
        // Validating Name Field
        //  $this->form_validation->set_rules('members', 'Member', 'required|min_length[1]|max_length[100]|xss_clean');
        // Validating Email Field
        $this->form_validation->set_rules('task', 'Task', 'trim|required|min_length[5]|max_length[1000]|xss_clean');
        if ($this->form_validation->run() == FALSE) {
            if (!empty($id)) {
                redirect("team/editTeam?id=$id");
            } else {

                $this->load->view('home/dashboard'); // just the header file
                $this->load->view('add_new');
                $this->load->view('home/footer'); // just the header file
            }
        } else {
            $data = array();
            $data = array(
                'name' => $name,
                'area' => $area,
                'members' => $members,
                'task' => $task
            );


            if (empty($id)) {     // Adding New team
                $this->team_model->insertTeam($data);
                $this->session->set_flashdata('feedback', 'Team Added');
                redirect('team');
            } else { // Updating team
                $this->team_model->updateTeam($id, $data);
                $this->session->set_flashdata('feedback', 'Updated');
                redirect('team');
            }
            // Loading View
        }
    }

    function getTeam() {
        $data['teams'] = $this->team_model->getTeam();
        $this->load->view('team', $data);
    }

    function editTeam() {
        $data = array();
        $data['areas'] = $this->area_model->getArea();
        $data['volunteers'] = $this->volunteer_model->getVolunteer();
        $id = $this->input->get('id');
        $data['team'] = $this->team_model->getTeamById($id);
        $this->load->view('home/dashboard'); // just the header file
        $this->load->view('add_new', $data);
        $this->load->view('home/footer'); // just the footer file
    }

    function editTeamByJason() {
        $id = $this->input->get('id');
        $data['team'] = $this->team_model->getTeamById($id);
        echo json_encode($data);
    }

    function teamDetails() {
        $team_id = $this->input->get('team_id');
        $data['volunteers'] = $this->volunteer_model->getVolunteer();
        $data['team_details'] = $this->team_model->getTeamById($team_id);
        $this->load->view('home/dashboard'); // just the header file
        $this->load->view('teamdetails', $data);
        $this->load->view('home/footer'); // just the footer file
    }

    function addTeamMember() {
        $id = $this->input->post('team_id');
        $pre_mem = $this->team_model->getTeamById($id)->members;
        $previous_members = explode(',', $pre_mem);
        $members = $this->input->post('members');
        if (!empty($members)) {
            $new_members = explode(',', implode(',', $members));
            $new_lineup = array_merge($previous_members, $new_members);
            $new_lineup = implode(',', $new_lineup);
        } else {
            $new_lineup = implode(',', $previous_members);
        }
        $data = array(
            'members' => $new_lineup
        );
        $this->team_model->updateTeam($id, $data);
        $this->session->set_flashdata('feedback', 'Updated');
        redirect('team/teamDetails?team_id=' . $id);
    }

    function deleteTeamMember() {
        $team_id = $this->input->get('team_id');
        $member_id = $this->input->get('member_id');
        $members = $this->team_model->getTeamById($team_id)->members;
        $members = explode(',', $members);
        $index = array_search($member_id, $members);
        unset($members[$index]);
        $new_lineup = implode(',', $members);
        $data = array(
            'members' => $new_lineup
        );
        $this->team_model->updateTeam($team_id, $data);
        $this->session->set_flashdata('feedback', 'Deleted');
        redirect('team/teamDetails?team_id=' . $team_id);
    }

    function delete() {
        $id = $this->input->get('id');
        $this->team_model->delete($id);
        $this->session->set_flashdata('feedback', 'Deleted');
        redirect('team');
    }

}

/* End of file team.php */
/* Location: ./application/modules/team/controllers/team.php */
