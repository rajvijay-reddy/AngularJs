package sample.hello.resources.service;

import java.util.ArrayList;
import java.util.List;

import sample.hello.resources.model.Message;

public class MessageService {

	public List<Message> getAllMessages() {

//private Message(long id, String message, String author) {
		Message m1 = new Message(1, "Hello jersey", "Vijaya");
		Message m2 = new Message(2, "Hello world", "Vijaya");
		
		List<Message> list = new ArrayList<>();
		list.add(m1);
		list.add(m2);
		
		return list;
	}
}
