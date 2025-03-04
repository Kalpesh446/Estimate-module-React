import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // usestate
  const [sections, setSections] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    fetch("React JS- Estimate_detail.json")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data?.data?.sections) {
          setSections(data.data.sections);
          calculateGrandTotal(data.data.sections);
        }
      })
      .catch(() => alert("Failed to load estimate data."));
  }, []);

  const handleInputChange = (sectionIndex, itemIndex, field, value) => {
    const updatedSections = [...sections];
    let item = updatedSections[sectionIndex].items[itemIndex];

    item[field] = parseFloat(value) || 0;
    item.total = ((item.quantity || 0) * (item.unit_cost || 0)) / 100;

    setSections(updatedSections);
    calculateGrandTotal(updatedSections);
  };

  const calculateGrandTotal = (sections) => {
    let total = sections.reduce(
      (acc, section) =>
        acc +
        section.items.reduce(
          (secTotal, item) => secTotal + (item.quantity * item.unit_cost) / 100,
          0
        ),
      0
    );
    setGrandTotal(total);
  };

  return (
    <>
      <div className="container">
        <h2>Estimate Summary</h2>
        <h3>Grand Total: ${grandTotal.toFixed(2)}</h3>
        <div id="estimate-container">
          {sections.map((section, sectionIndex) => {
            let sectionTotal = section.items.reduce(
              (acc, item) =>
                acc + ((item.quantity * item.unit_cost) / 100 || 0),
              0
            );

            return (
              <div
                key={section.id || `section-${sectionIndex}`}
                className="section"
              >
                <h3 className="section-title">
                  {section.section_name} Section
                </h3>
                <table className="estimate-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Item Name</th>
                      <th>QTY</th>
                      <th>Unit Cost</th>
                      <th>Unit</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section?.items?.map((item, itemIndex) => (
                      <tr key={item.id || `item-${sectionIndex}-${itemIndex}`}>
                        <td>{item.item_type_display_name}</td>
                        <td>{item.subject}</td>
                        <td>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleInputChange(
                                sectionIndex,
                                itemIndex,
                                "quantity",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.unit_cost / 100}
                            onChange={(e) =>
                              handleInputChange(
                                sectionIndex,
                                itemIndex,
                                "unit_cost",
                                e.target.value * 100
                              )
                            }
                          />
                        </td>
                        <td>{item.unit}</td>
                        <td className="item-total">
                          $
                          {(
                            (item.quantity * item.unit_cost) / 100 || 0
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="5">
                        <strong>Section Total</strong>
                      </td>
                      <td className="section-total">
                        ${(sectionTotal || 0).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
