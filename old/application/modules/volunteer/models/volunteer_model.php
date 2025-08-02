<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Volunteer_model extends CI_model {

    function __construct() {
        parent::__construct();
        $this->load->database();
    }

    function insertVolunteer($data) {
        $this->db->insert('volunteer', $data);
    }

    function getVolunteer() {
        $this->db->order_by('id', 'desc');
        $query = $this->db->get('volunteer');
        return $query->result();
    }

    function getVolunteerById($id) {
        $this->db->where('id', $id);
        $query = $this->db->get('volunteer');
        return $query->row();
    }

    function updateVolunteer($id, $data) {
        $this->db->where('id', $id);
        $this->db->update('volunteer', $data);
    }

    function delete($id) {
        $this->db->where('id', $id);
        $this->db->delete('volunteer');
    }

    function updateIonUser($username, $email, $password, $ion_user_id) {
        $uptade_ion_user = array(
            'username' => $username,
            'email' => $email,
            'password' => $password
        );
        $this->db->where('id', $ion_user_id);
        $this->db->update('users', $uptade_ion_user);
    }

}
