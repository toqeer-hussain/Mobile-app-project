import React, { useEffect, useState } from "react";
import { FlatList, Text, Platform } from "react-native";

import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";

import firebase from "../../Firebase";
const OrdersScreen = (props) => {
  const [orderlist, setorderlist] = useState([]);
  const db = firebase.firestore();
  const userid = firebase.auth().currentUser.uid;
  useEffect(() => {
    db.collection("order")
      .doc(userid)
      .collection("orderlist")
      .onSnapshot((data) => {
        let order = [];
        data.forEach((d) => {
          let obj = { id: d.id, ...d.data() };
          order.push(obj);
        });
        setorderlist(order);
      });
  }, []);
  return (
    <FlatList
      data={orderlist}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => {
        return (
          <OrderItem
            orderid={itemData.item.id}
            status={itemData.item.status}
            orderdate={itemData.item.order_at}
            total={itemData.item.total}
          />
        );
      }}
    />
  );
};

export const screenOptions = (navData) => {
  return {
    headerTitle: "Your Orders",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

export default OrdersScreen;
