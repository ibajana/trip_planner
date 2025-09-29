import { useState } from "react"
import TripForm from '../components/TripForm'
import { useNavigate } from 'react-router-dom'
import { Modal, ModalHeader, ModalBody } from "reactstrap"
import TextType from '../components/TextType'
export default function Home() {
    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = useState(false)
    const handleResult = (data) => {
        navigate('/results', { state: { result: data } })
    }


    return (
        <>
            <TextType
                text={["Plan your trip", "Automatically fill out your Log sheet", "Enjoy your day!"]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
                textColors={[
                    "black"
                ]}
                className='text-center p-4 display-1 mx-auto'
            />
            <div className="container py-4">
                <div className="row">
                    <div className="col-12 mb-3">
                        <div
                            className="card clickable-card shadow-sm"
                            role="button"
                            tabIndex={0}
                            onClick={() => setModalOpen(true)}
                        >
                            <div className="card-body text-center">
                                Create new log sheets
                            </div>
                        </div>
                    </div>

                    <div className="col-12 mb-3">
                        <div
                            className="card clickable-card shadow-sm"
                            role="button"
                            tabIndex={0}
                            onClick={() => navigate("/list")}
                        >
                            <div className="card-body text-center">
                                View old sheets
                            </div>
                        </div>
                    </div>
                </div>

                {/*Modals*/}
                <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
                    <ModalHeader toggle={() => setModalOpen(false)}>
                        Create New Log Sheets
                    </ModalHeader>
                    <ModalBody>
                        <p>Complete all fields to generate a new log sheet</p>
                        <TripForm onResult={handleResult}/>
                    </ModalBody>
                </Modal>
            </div>
        </>
    )
}
