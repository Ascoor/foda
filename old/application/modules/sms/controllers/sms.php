<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Sms extends MX_Controller {

    function __construct() {
        parent::__construct();
        $this->load->library('Ion_auth');
        $this->load->library('session');
        $this->load->library('form_validation');
        $this->load->model('sms_model');
        $this->load->model('area/area_model');
        $this->load->model('voter/voter_model');
        $this->load->model('team/team_model');
        $this->load->model('volunteer/volunteer_model');
        $this->load->model('ion_auth_model');
        if (!$this->ion_auth->logged_in()) {
            redirect('auth/login', 'refresh');
        }
    }

    public function index() {
        $data = array();
        $id = $this->ion_auth->get_user_id();
        $data['sms'] = $this->sms_model->getProfileById($id);
        $this->load->view('home/dashboard'); // just the header file
        $this->load->view('profile', $data);
        $this->load->view('home/footer'); // just the footer file
    }

    public function sendView() {
        $data = array();
        $id = $this->ion_auth->get_user_id();
        $data['areas'] = $this->area_model->getArea();
        $data['sms'] = $this->sms_model->getSmsSettingsById($id);
        $data['teams'] = $this->team_model->getTeam();
        $this->load->view('home/dashboard'); // just the header file
        $this->load->view('sendview', $data);
        $this->load->view('home/footer'); // just the footer file
    }

    public function settings() {
        $data = array();
        $id = $this->ion_auth->get_user_id();
        $data['settings'] = $this->sms_model->getSmsSettingsById($id);
        $this->load->view('home/dashboard'); // just the header file
        $this->load->view('settings', $data);
        $this->load->view('home/footer'); // just the footer file
    }

    public function addNewSettings() {

        $id = $this->input->post('id');
        $username = $this->input->post('username');
        $password = $this->input->post('password');
        $api_id = $this->input->post('api_id');

        $this->load->library('form_validation');
        $this->form_validation->set_error_delimiters('<div class="error">', '</div>');
        // Validating Name Field
        $this->form_validation->set_rules('username', 'Username', 'trim|required|min_length[5]|max_length[100]|xss_clean');
        // Validating Password Field
        if (!empty($password)) {
            $this->form_validation->set_rules('password', 'Password', 'trim|required|min_length[5]|max_length[100]|xss_clean');
        }
        // Validating Email Field
        $this->form_validation->set_rules('api_id', 'Api Id', 'trim|required|min_length[5]|max_length[100]|xss_clean');

        if ($this->form_validation->run() == FALSE) {
            $data = array();
            $id = $this->ion_auth->get_user_id();
            $data['sms'] = $this->sms_model->getSmsSettingsById($id);
            $this->load->view('home/dashboard'); // just the header file
            $this->load->view('settings', $data);
            $this->load->view('home/footer'); // just the footer file
        } else {
            $data = array();
            $data = array(
                'username' => $username,
                'password' => $password,
                'api_id' => $api_id
            );
            if (empty($this->sms_model->getSmsSettingsById($id)->username)) {
                $this->sms_model->addSmsSettings($data);
                $this->session->set_flashdata('feedback', 'Added');
            } else {
                $this->sms_model->updateSmsSettings($data);
                $this->session->set_flashdata('feedback', 'Updated');
            }
            redirect('sms/settings');
        }
    }

    function sendVoter() {
        $userId = $this->ion_auth->get_user_id();
        $voters = $this->voter_model->getVoter();
        $smsSettings = $this->sms_model->getSmsSettingsById($userId);
        $username = $smsSettings->username;
        $password = $smsSettings->password;
        $api_id = $smsSettings->api_id;
        foreach ($voters as $voter) {
            $to[] = $voter->phone;
        }
        $to = implode(',', $to);
        // $message = urlencode("Test Message");
        if (!empty($to)) {
            $message = $this->input->post('message');
            file_get_contents('https://api.clickatell.com/http/sendmsg?user=' . $username . '&password=' . $password . '&api_id=' . $api_id . '&to=' . $to . '&text=' . $message);
            $this->session->set_flashdata('feedback', 'Message Sent');
        } else {
            $this->session->set_flashdata('feedback', 'Not Sent');
        }
        redirect('sms/sendView');
    }

    function sendVoterAreaWise() {
        $area_id = $this->input->post('area_id');
        $userId = $this->ion_auth->get_user_id();
        $voters = $this->voter_model->getVoter();
        $smsSettings = $this->sms_model->getSmsSettingsById($userId);
        $username = $smsSettings->username;
        $password = $smsSettings->password;
        $api_id = $smsSettings->api_id;
        foreach ($voters as $voter) {
            if ($voter->area == $area_id) {
                $to[] = $voter->phone;
            }
        }
        if (!empty($to)) {
            $to = implode(',', $to);
            $message = $this->input->post('message');
            file_get_contents('https://api.clickatell.com/http/sendmsg?user=' . $username . '&password=' . $password . '&api_id=' . $api_id . '&to=' . $to . '&text=' . $message);
            $this->session->set_flashdata('feedback', 'Message Sent');
        } else {
            $this->session->set_flashdata('feedback', 'Message Failed');
        }
        redirect('sms/sendView');
    }

    function sendVolunteer() {
        $userId = $this->ion_auth->get_user_id();
        $volunteers = $this->volunteer_model->getVolunteer();
        $smsSettings = $this->sms_model->getSmsSettingsById($userId);
        $username = $smsSettings->username;
        $password = $smsSettings->password;
        $api_id = $smsSettings->api_id;
        foreach ($volunteers as $volunteer) {
            $to[] = $volunteer->phone;
        }
        if (!empty($to)) {
            $to = implode(',', $to);
            $message = $this->input->post('message');
            file_get_contents('https://api.clickatell.com/http/sendmsg?user=' . $username . '&password=' . $password . '&api_id=' . $api_id . '&to=' . $to . '&text=' . $message);
            $this->session->set_flashdata('feedback', 'Message Sent');
        } else {
            $this->session->set_flashdata('feedback', 'Message Failed');
        }
        redirect('sms/sendView');
    }

    function sendVolunteerAreaWise() {
        $area_id = $this->input->post('area_id');
        $userId = $this->ion_auth->get_user_id();
        $volunteers = $this->volunteer_model->getVolunteer();
        $smsSettings = $this->sms_model->getSmsSettingsById($userId);
        $username = $smsSettings->username;
        $password = $smsSettings->password;
        $api_id = $smsSettings->api_id;
        foreach ($volunteers as $volunteer) {
            if ($volunteer->area == $area_id) {
                $to[] = $volunteer->phone;
            }
        }
        if (!empty($to)) {
            $to = implode(',', $to);
            $message = $this->input->post('message');
            // $message = urlencode("Test Message");
            file_get_contents('https://api.clickatell.com/http/sendmsg?user=' . $username . '&password=' . $password . '&api_id=' . $api_id . '&to=' . $to . '&text=' . $message);
            $this->session->set_flashdata('feedback', 'Message Sent');
        } else {
            $this->session->set_flashdata('feedback', 'Message Failed');
        }
        redirect('sms/sendView');
    }

    function sendSmsToSpecificVolunteer() {
        $userId = $this->ion_auth->get_user_id();
        $smsSettings = $this->sms_model->getSmsSettingsById($userId);
        $username = $smsSettings->username;
        $password = $smsSettings->password;
        $api_id = $smsSettings->api_id;

        $to = $this->input->post('number');
        $message = $this->input->post('message');
        $recipient = $this->input->post('volunteer_namee') . '<br>' . $this->input->post('number');
        if (!empty($to)) {
            $message = $this->input->post('message');
            file_get_contents('https://api.clickatell.com/http/sendmsg?user=' . $username . '&password=' . $password . '&api_id=' . $api_id . '&to=' . $to . '&text=' . $message);
            $data = array();
            $date = time();
            $data = array(
                'message' => $message,
                'date' => $date,
                'recipient' => $recipient
            );
            $this->sms_model->insertSms($data);
            $this->session->set_flashdata('feedback', 'Message Sent');
        } else {
            $this->session->set_flashdata('feedback', 'Message Failed');
        }
        redirect('volunteer');
    }

    function sendSmsTeamWise() {
        $team_id = $this->input->post('team_id');
        $userId = $this->ion_auth->get_user_id();
        $volunteers = $this->volunteer_model->getVolunteer();

        $teamdetails = $this->team_model->getTeamById($team_id);
        $members = $teamdetails->members;
        $members = explode(',', $members);

        $smsSettings = $this->sms_model->getSmsSettingsById($userId);
        $username = $smsSettings->username;
        $password = $smsSettings->password;
        $api_id = $smsSettings->api_id;

        foreach ($members as $member) {
            foreach ($volunteers as $volunteer) {
                if ($volunteer->id == $member) {
                    $to[] = $volunteer->phone;
                }
            }
        }
        if (!empty($to)) {
            $to = implode(',', $to);
            $message = $this->input->post('message');
            // $message = urlencode("Test Message");
            file_get_contents('https://api.clickatell.com/http/sendmsg?user=' . $username . '&password=' . $password . '&api_id=' . $api_id . '&to=' . $to . '&text=' . $message);
            $this->session->set_flashdata('feedback', 'Message Sent');
        } else {
            $this->session->set_flashdata('feedback', 'Message Failed');
        }
        redirect('sms/sendView');
    }

    function sendAllTeam() {
        $userId = $this->ion_auth->get_user_id();
        $teams = $this->team_model->getVolunteer();
        $smsSettings = $this->sms_model->getSmsSettingsById($userId);
        $username = $smsSettings->username;
        $password = $smsSettings->password;
        $api_id = $smsSettings->api_id;
        foreach ($teams as $team) {
            $to[] = $volunteer->phone;
        }
        if (!empty($to)) {
            $to = implode(',', $to);
            $message = $this->input->post('message');
            file_get_contents('https://api.clickatell.com/http/sendmsg?user=' . $username . '&password=' . $password . '&api_id=' . $api_id . '&to=' . $to . '&text=' . $message);
            $this->session->set_flashdata('feedback', 'Message Sent');
        } else {
            $this->session->set_flashdata('feedback', 'Message Failed');
        }
        redirect('sms/sendView');
    }

    function send() {
        $userId = $this->ion_auth->get_user_id();
        $is_v_v = $this->input->post('radio');
        $smsSettings = $this->sms_model->getSmsSettingsById($userId);
        $username = $smsSettings->username;
        $password = $smsSettings->password;
        $api_id = $smsSettings->api_id;

        if ($is_v_v == 'allvoter') {
            $voters = $this->voter_model->getVoter();
            foreach ($voters as $voter) {
                $to[] = $voter->phone;
            }
            $recipient = 'All Voter';
        }

        if ($is_v_v == 'allvolunteer') {
            $volunteers = $this->volunteer_model->getVolunteer();
            foreach ($volunteers as $volunteer) {
                $to[] = $volunteer->phone;
            }
            $recipient = 'All Volunteer';
        }
        $to = implode(',', $to);
        // $message = urlencode("Test Message");
        if (!empty($to)) {
            $message = $this->input->post('message');
            file_get_contents('https://api.clickatell.com/http/sendmsg?user=' . $username . '&password=' . $password . '&api_id=' . $api_id . '&to=' . $to . '&text=' . $message);
            $data = array();
            $date = time();
            $data = array(
                'message' => $message,
                'date' => $date,
                'recipient' => $recipient
            );
            $this->sms_model->insertSms($data);
            $this->session->set_flashdata('feedback', 'Message Sent');
        } else {
            $this->session->set_flashdata('feedback', 'Not Sent');
        }
        redirect('sms/sendView');
    }

    function sent() {
        $data['sents'] = $this->sms_model->getSms();
        $this->load->view('home/dashboard');
        $this->load->view('sms', $data);
        $this->load->view('home/footer');
    }

}

/* End of file profile.php */
/* Location: ./application/modules/profile/controllers/profile.php */
