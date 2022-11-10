<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Team_model extends CI_model {

    function __construct() {
        parent::__construct();
        $this->load->database();
    }

    function insertTeam($data) {
        $this->db->insert('team', $data);
    }

    function getTeam() {
        $this->db->order_by("id", "asc");
        $query = $this->db->get('team');
        return $query->result();
    }

    function getTeamById($id) {
        $this->db->where('id', $id);
        $query = $this->db->get('team');
        return $query->row();
    }

    function updateTeam($id, $data) {
        $this->db->where('id', $id);
        $this->db->update('team', $data);
    }

    function delete($id) {
        $this->db->where('id', $id);
        $this->db->delete('team');
    }

}
