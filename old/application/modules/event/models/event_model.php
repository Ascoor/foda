<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Event_model extends CI_model {

    function __construct() {
        parent::__construct();
        $this->load->database();
    }

    function insertEvent($data) {
        $this->db->insert('event', $data);
    }

    function getEvent() {
        $this->db->order_by("id", "desc");
        $query = $this->db->get('event');
        return $query->result();
    }

    function getEventById($id) {
        $this->db->where('id', $id);
        $query = $this->db->get('event');
        return $query->row();
    }

    function updateEvent($id, $data) {
        $this->db->where('id', $id);
        $this->db->update('event', $data);
    }

    function delete($id) {
        $this->db->where('id', $id);
        $this->db->delete('event');
    }

}
