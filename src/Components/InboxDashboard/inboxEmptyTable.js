import React from "react";

const InboxEmptyTable = (props) => {
    return (
        <div className="row m-0 mb-2">
            <div className="full-width-block p-l-0 pr-0" onclick="openModal(this,{{doc_panel.document.id}})" id="cold">
                <div className="table-responsive table-responsive-2 table--no-card m-b-40 position-relative has-tint-rows has-tint-h-272 has-tint-top-25 ">
                    <table className="table table-earning t-b-0 position-relative fake-rows-2 table-striped" id="table-{{doc_panel.document.id}}-tab1">
                        <tbody style={{ maxHeight: '100px !important', overflowY: 'scroll' }}>
                            <tr className="tab-row table-fake-row">
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                            </tr>
                            <tr className="tab-row table-fake-row">
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                            </tr>
                            <tr className="tab-row table-fake-row">
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                            </tr>
                            <tr className="tab-row table-fake-row">
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                            </tr>
                            <tr className="tab-row table-fake-row">
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                            </tr>
                            <tr className="tab-row table-fake-row">
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                            </tr>
                            <tr className="tab-row table-fake-row">
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                            </tr>
                            <tr className="tab-row table-fake-row">
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                            </tr>
                            <tr className="tab-row table-fake-row">
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                            </tr>
                            <tr className="tab-row table-fake-row">
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default InboxEmptyTable;