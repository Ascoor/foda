<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Snw_model extends CI_model {

    function __construct() {
        parent::__construct();
        $this->load->database();
    }

    function insertSnw($data) {
        $this->db->insert('snw', $data);
    }

    function getSnw() {
        $this->db->order_by("id", "desc");
        $query = $this->db->get('snw');
        return $query->result();
    }

    function getSnwById($id) {
        $this->db->where('id', $id);
        $query = $this->db->get('snw');
        return $query->row();
    }

    function updateSnw($id, $data) {
        $this->db->where('id', $id);
        $this->db->update('snw', $data);
    }

    function delete($id) {
        $this->db->where('id', $id);
        $this->db->delete('snw');
    }
    
}
