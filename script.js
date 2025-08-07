
// Initialize Stripe with your test publishable key
const stripe = Stripe('pk_test_51Rrm7iJqPXDDDPeGLYGbNBTv71qFVetTgFmul0QQc7LTi00jOiFTaBCRyPfRzFN7khWDv1qBLtBN9gFJ2810LqD00UjMzLASN');
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('🟢 DOM loaded, setting up checkout buttons...');
  
  // Check for referrer code in URL and display it
  const urlParams = new URLSearchParams(window.location.search);
  const referrerCode = urlParams.get('ref');
  
  if (referrerCode) {
    console.log('🎯 Referrer code detected:', referrerCode);
    
    // Create a small banner to show referrer info
    const referrerBanner = document.createElement('div');
    referrerBanner.style.cssText = `
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      padding: 10px;
      text-align: center;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      font-size: 14px;
      font-weight: bold;
    `;
    referrerBanner.innerHTML = `🎉 Referred by code: ${referrerCode} - Special bonus opportunity!`;
    document.body.insertBefore(referrerBanner, document.body.firstChild);
    
    // Adjust body padding to accommodate banner
    document.body.style.paddingTop = '50px';
  }
  
  // Find checkout button
  const checkoutButton = document.getElementById('checkout-button-2');
  const agreeCheckbox = document.getElementById('agree');
  
  console.log(`🎯 Found ${checkoutButton ? 1 : 0} buttons to set up`);
  
  if (checkoutButton) {
    console.log(`🔧 Setting up button: "${checkoutButton.textContent.trim()}"`);
    
    // Remove any existing listeners and add new one
    checkoutButton.removeEventListener('click', handleCheckout);
    checkoutButton.addEventListener('click', handleCheckout);
    
    // Also test click detection
    checkoutButton.addEventListener('click', function(e) {
      console.log('🖱️ RAW CLICK DETECTED on:', checkoutButton.textContent.trim());
    });
  }
  
  console.log('✅ All buttons configured');
  
  // Set up terms checkbox functionality
  function updateButtonState() {
    const termsAccepted = agreeCheckbox ? agreeCheckbox.checked : false;
    
    if (checkoutButton) {
      checkoutButton.disabled = !termsAccepted;
      checkoutButton.style.opacity = termsAccepted ? '1' : '0.5';
    }
  }
  
  // Set initial state
  updateButtonState();
  
  // Listen for checkbox changes
  if (agreeCheckbox) {
    agreeCheckbox.addEventListener('change', updateButtonState);
  }
  
  console.log('Terms acceptance:', { 
    banner: referrerCode ? true : false
  });
  
  console.log('✅ Terms checkbox configured');
  
  // Modal functionality for Terms & Conditions
  const modal = document.getElementById('terms-modal');
  const termsTitle = document.querySelector('.terms-container h2');
  const closeModal = document.querySelector('.close');
  
  if (termsTitle && modal) {
    termsTitle.style.cursor = 'pointer';
    termsTitle.addEventListener('click', function() {
      modal.style.display = 'block';
    });
  }
  
  if (closeModal && modal) {
    closeModal.addEventListener('click', function() {
      modal.style.display = 'none';
    });
  }
  
  // Close modal when clicking outside of it
  if (modal) {
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
});
// Checkout handler function - PROPERLY HOOKED TO BACKEND
async function handleCheckout(event) {
  event.preventDefault();
  
  console.log('🚀 Starting checkout process...');
  
  // Get referrer code from URL if present
  const urlParams = new URLSearchParams(window.location.search);
  const referrerCode = urlParams.get('ref');
  
  console.log('📝 Checkout details:', {
    referrerCode: referrerCode || 'None',
    timestamp: new Date().toISOString()
  });
  
  try {
    console.log('🌐 Creating Stripe checkout session...');
    
    // Create checkout session with referrer code - CONNECTS TO YOUR BACKEND
    const requestBody = {
      referrer_code: referrerCode || null
    };
    
    console.log('📤 Sending request to /create-checkout-session:', requestBody);
    
    const response = await fetch('/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('📥 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Server error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const session = await response.json();
    console.log('✅ Checkout session created:', session);
    
    // Redirect to Stripe Checkout
    console.log('🔗 Redirecting to Stripe checkout...');
    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });
    
    if (result.error) {
      console.error('❌ Stripe checkout error:', result.error.message);
      alert('Checkout failed: ' + result.error.message);
    }
    
  } catch (error) {
    console.error('❌ Checkout failed:', error);
    alert('Checkout failed. Please try again. Error: ' + error.message);
  }
}
