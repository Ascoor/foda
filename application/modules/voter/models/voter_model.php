<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Voter_model extends CI_model {

    function __construct() {
        parent::__construct();
        $this->load->database();
    }

    function insertVoter($data) {
        $this->db->insert('voter', $data);
    }

    function getVoter() {
        $this->db->order_by("id", "desc");
        $query = $this->db->get('voter');
        return $query->result();
    }

    function getVoterById($id) {
        $this->db->where('id', $id);
        $query = $this->db->get('voter');
        return $query->row();
    }

    function updateVoter($id, $data) {
        $this->db->where('id', $id);
        $this->db->update('voter', $data);
    }

    function delete($id) {
        $this->db->where('id', $id);
        $this->db->delete('voter');
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

    function getBloodBank() {
        $query = $this->db->get('bbank');
        return $query->result();
    }

}
