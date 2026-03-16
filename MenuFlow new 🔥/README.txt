

Ordering fix
- storefront buttons now say Add to Order
- customers can add multiple items
- customers can open a cart
- customers can place an order from the storefront


Orders and notifications fix
- customer orders now save through MenuFlowDemo.createOrder
- owner dashboard orders page now lists placed orders
- kitchen page now shows active orders
- customer tracking page now shows order status updates
- when owner changes status, customer notifications update on the tracking page


Netlify shared publish fix
- owner can now publish the storefront to a Netlify function-backed shared store
- customers on other devices can load the real hero and real menu after publish
- customer orders now save through Netlify functions
- owner orders screen, kitchen screen, and tracking page now read shared order data

How to use
1. deploy this ZIP on Netlify
2. owner saves storefront or menu
3. click Publish Website
4. share the storefront link

Important
- this fix depends on Netlify Functions + Blobs working in the deployment
- this is the strongest honest fix possible without moving the whole app to Supabase


Auto publish upgrade
- saving storefront now auto publishes
- adding menu items now auto publishes
- editing availability now auto publishes
- deleting menu items now auto publishes
- manual publish buttons still remain as backup


Link visibility fix
- website link now stays hidden until publish succeeds
- cleaner business-name link added: /shop/<slug>
- clearer publish failure message
