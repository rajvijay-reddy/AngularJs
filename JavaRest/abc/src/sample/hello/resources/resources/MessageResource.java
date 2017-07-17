package sample.hello.resources.resources;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import sample.hello.resources.model.Message;
import sample.hello.resources.service.MessageService;

@Path("/messages")
public class MessageResource {

	@GET
	@Produces(MediaType.APPLICATION_XML)
	public List<Message> getMessages() {
		
		MessageService ms = new MessageService();
		return ms.getAllMessages();
	}
}
