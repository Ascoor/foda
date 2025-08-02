<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Area_model extends CI_model {

    function __construct() {
        parent::__construct();
        $this->load->database();
    }

    function insertArea($data) {
        $this->db->insert('area', $data);
    }

    function getArea() {
        $this->db->order_by("id", "asc");
        $query = $this->db->get('area');
        return $query->result();
    }

    function getAreaById($id) {
        $this->db->where('id', $id);
        $query = $this->db->get('area');
        return $query->row();
    }

    function updateArea($id, $data) {
        $this->db->where('id', $id);
        $this->db->update('area', $data);
    }

    function delete($id) {
        $this->db->where('id', $id);
        $this->db->delete('area');
    }

}
