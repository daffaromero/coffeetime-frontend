import React, { useState, useEffect } from "react";
import axios from 'axios';
import { PayPalButton } from "react-paypal-button-v2";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrderDetails, payOrder } from "../actions/orderActions";
import { ORDER_PAY_RESET } from "../constants/orderConstants";

const URI = "https://coffeetime-backend.vercel.app";

const OrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {id} = useParams();  

  const [sdkReady, setSdkReady] = useState(false);

  
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  
  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  if(!loading)
  {
    //Calculate prices
  order.itemsPrice = order.orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  order.taxPrice = Number(0.1 * order.itemsPrice);
  order.totalPrice = Number(order.itemsPrice) + Number(order.taxPrice);
  }

  useEffect(() => {
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get(URI + `/api/v1/config/paypal`)
      //console.log(clientId)
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }

    //addPayPalScript();

    if(!order || order._id !== id) {
      if(!order || successPay) {
        dispatch({type: ORDER_PAY_RESET})
        dispatch(getOrderDetails(id));
      } else if(!order.isPaid) {
        if(!window.paypal) {
          addPayPalScript()
        } else {
          setSdkReady(true)
        }
      }
    }
  }, [dispatch, order, id, successPay]);

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult)
    dispatch(payOrder(id, paymentResult))
  }

  return ( loading ? ( <Loader /> ) : error ? ( <Message variant='danger'>{error}</Message> ) : ( <>
    <h1>Order {order._id}</h1>
    <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Table Information</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Table: </strong>
                {order.shippingAddress}
              </p>
              {order.isDelivered ? <Message variant='success'>Served on {order.deliveredAt}</Message> : <Message variant='danger'>Not Served</Message>}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? <Message variant='success'>Paid on {order.paidAt}</Message> : <Message variant='danger'>Not Paid</Message>}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            <strong>
                            {item.name}
                            </strong>
                            
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x Rp{item.price} = Rp
                          {item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>Rp{order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant='danger'>{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>Rp{order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>Rp{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader/>}
                  {!sdkReady ? <Loader /> : (
                    <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler}/>
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
  </>
  ))
};

export default OrderScreen;