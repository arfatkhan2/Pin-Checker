class PinCodeChecker extends HTMLElement {
    constructor() {
        super();

        // Attach shadow DOM
        this.attachShadow({ mode: 'open' });

        // Create container for input, button, and result
        const container = document.createElement('div');
        container.classList.add('container');

        // Create input element
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Enter your pincode');
        container.appendChild(input);

        // Create submit button
        const button = document.createElement('button');
        button.textContent = "Submit";
        container.appendChild(button);

        // Create container for result
        const resultContainer = document.createElement('div');
        resultContainer.classList.add('result');
        container.appendChild(resultContainer);

        // Append container to shadow DOM
        this.shadowRoot.appendChild(container);

        // Add event listener to button
        button.addEventListener('click', () => {
            const pincode = input.value.trim();
            if (pincode !== '' && !isNaN(pincode) && pincode.length === 6) {
                console.log(pincode);
                this.getData(pincode);
            } else {
                alert("Enter a valid six-digit pincode");
                input.value = '';
            }
        });

        // Add CSS for styling
        const style = document.createElement('style');
        style.textContent = `
            .container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                text-align: center;
            }

            input[type="text"] {
                padding: 10px;
                margin-bottom: 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
                width: 200px;
            }

            button {
                padding: 10px 20px;
                border: none;
                background-color: #4CAF50;
                color: white;
                border-radius: 4px;
                cursor: pointer;
                margin-bottom: 10px;
            }

            button:hover {
                background-color: #45a049;
            }

            .result {
                margin-top: 20px;
            }
        `;

        // Append style to shadow DOM
        this.shadowRoot.appendChild(style);
    }

    async getData(pincode) {
        try {
            const res = await fetch('https://api.postalpincode.in/pincode/' + pincode);
            const data = await res.json();
            console.log(data);
            this.showData(data);
        } catch (err) {
            console.error("Error while fetching data ", err);
        }
    }

    showData(data) {
        const postalData = data[0].PostOffice;
        const resultContainer = this.shadowRoot.querySelector('.result');
        resultContainer.innerHTML = '';

        if (postalData && postalData.length > 0) {
            // Display only the first address
            const place = postalData[0];
            const deliveryStatus = place.DeliveryStatus === 'Delivery' ? 'Delivery Available' : 'Delivery Not Available';
            const para = document.createElement('p');
            para.textContent = `${place.Name}: ${deliveryStatus}`;
            para.style.color = place.DeliveryStatus === 'Delivery' ? 'green' : 'red'; // Set color based on delivery status
            resultContainer.appendChild(para);
        } else {
            // If no records found, display a message
            const para = document.createElement('p');
            para.textContent = `No Records Found`;
            resultContainer.appendChild(para);
        }
    }
}

// Define the custom element
customElements.define('pincode-checker', PinCodeChecker);
