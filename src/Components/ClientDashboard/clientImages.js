import React, { useState } from "react";
import Modal from "./modals/modal";
import AvatarModal from "./modals/AvatarModal";
import "../../../public/BP_resources/css/client-4.css";
import avatar from "../../../public/bp_assets/img/avatar_new.svg";
import { mediaRoute } from "../../Utils/helper";

const ClientImages = ({ image1, image2, image3, modalEditShowValue, photos, Avatars, first_name, last_name, middle_name }) => {

    const [clientAvatar, setClientAvatar] = useState(false);

    const showClientAvatar = (event) => {
        event.preventDefault();
        setClientAvatar(!clientAvatar)
    }

    const handleEditShowModal = () => {
        modalEditShowValue(true);
    }

    return (
            <div class="height-90" style={{height:"112px"}}>
                <div class=" flex-g-1">
                    <h4 class="client-contact-title text-center">client avatar</h4>
                </div>
                <div class="col-auto d-flex flex-column justify-content-center align-items-center p-0 m-l-5 m-r-5">
                    <div class="d-flex justify-content-center align-items-center " onClick={handleEditShowModal}>
                        <div class="client-image position-relative image-container cursor-pointer mr-0 border-overlay-client" data-toggle="modal" data-target="#changeAvatar">
                            {image1 ? (
                                <img class="" src={image1} alt="Pic 1" />
                            ) : (
                                <img class="" src={avatar} alt="Pic 1" />
                            )
                            }
                        </div>
                        <div className="m-l-10 d-flex justify-content-between align-items-center flex-column ">
                            <div className="img-align-sm-mobile mb-1 client-image ic-19-client-image border-overlay-client">
                                {image3 ? (
                                    <img class="images-client" src={image2} alt="Pic 2" />
                                ) : (
                                    <img class="images-client" src={avatar} alt="Pic 2" />
                                )
                                }
                            </div>
                            <div className="img-align-mobile ic-29-client-image  client-image border-overlay-client">
                                {image3 ? (
                                    <img class="images-client" src={image3} alt="Pic 3" />
                                ) : (
                                    <img class="images-client" src={avatar} alt="Pic 3" />
                                )
                                }
                            </div>
                        </div>

                    </div>

                </div>
                <div class="text-center font-weight-semibold text-lg primary-color-text-client" data-toggle="modal" data-target="#changeAvatar" onClick={handleEditShowModal} style={{paddingTop:"6px"}}>Click to Edit</div>
            

            <Modal show={clientAvatar} onHide={() => setClientAvatar(false)}>
                <AvatarModal photos={photos} middle_name={middle_name} Avatars={Avatars} hideModal={showClientAvatar} last_name={last_name} first_name={first_name} />
            </Modal>
        </div>
    );
};

export default ClientImages;

