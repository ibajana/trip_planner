import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    InputGroup,
    InputGroupText,
    Col,
    Row,
} from "reactstrap";

const ContactSimpleForm = () => {

    return (
        <section className="bg-primary py-5">
            <div className="container px-4">
                <div className="mx-auto text-center" style={{ maxWidth: "40rem" }}>
                    <h2 className="mt-3 fw-bold text-dark">Get in touch</h2>
                    <p className="mt-3 text-muted fs-5">
                        We'd love to hear from you. Please fill out this form.
                    </p>
                </div>

                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const data = Object.fromEntries(new FormData(e.currentTarget));
                        console.log("Form data:", data);
                    }}
                    className="mx-auto mt-5"
                    style={{ maxWidth: "50rem" }}
                >
                    <Row>
                        {/* First name */}
                        <Col md={6}>
                            <FormGroup>
                                <Label for="firstName">First name</Label>
                                <Input
                                    required
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    placeholder="First name"
                                />
                            </FormGroup>
                        </Col>

                        {/* Last name */}
                        <Col md={6}>
                            <FormGroup>
                                <Label for="lastName">Last name</Label>
                                <Input
                                    required
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Last name"
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    {/* Email */}
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input
                            required
                            type="email"
                            id="email"
                            name="email"
                            placeholder="you@company.com"
                        />
                    </FormGroup>

                    {/* Message */}
                    <FormGroup>
                        <Label for="message">Message</Label>
                        <Input
                            required
                            type="textarea"
                            id="message"
                            name="message"
                            rows="5"
                            placeholder="Leave us a message..."
                        />
                    </FormGroup>

                    {/* Checkbox */}
                    <FormGroup check>
                        <Input type="checkbox" id="privacy" name="privacy" required />
                        <Label for="privacy" check>
                            You agree to our friendly{" "}
                            <a href="#" className="text-decoration-underline">
                                privacy policy
                            </a>.
                        </Label>
                    </FormGroup>

                    {/* Submit */}
                    <div className="mt-4">
                        <Button color="primary" size="lg" type="submit" block>
                            Send message
                        </Button>
                    </div>
                </Form>
            </div>
        </section>
    );
};

export default ContactSimpleForm;