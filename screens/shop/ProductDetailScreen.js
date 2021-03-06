import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";

import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";

import { Ionicons } from "@expo/vector-icons";
import { Badge } from "react-native-paper";

import firebase from "../../Firebase";
const db = firebase.firestore();

import * as Animatable from "react-native-animatable";
const ProductDetailScreen = (props) => {
  const [product, setproductdetail] = useState({});
  const [cartcount, setcartcount] = useState(0);
  const productId = props.route.params.productId;
  const userid = firebase.auth().currentUser.uid;

  useEffect(() => {
    db.collection("product")
      .doc(productId)
      .get()
      .then((querySnapshot) => {
        setproductdetail({ id: querySnapshot.id, ...querySnapshot.data() });
      });
    db.collection("cart")
      .doc(userid)
      .collection("cartitem")
      .onSnapshot((querySnapshot) => {
        let testarr = [];
        querySnapshot.forEach((doc) => testarr.push(doc.data()));
        setcartcount(testarr.length);
      });
  }, []);

  console.log(product);
  const AddnewDoc = () => {
    db.collection("cart")
      .doc(userid)
      .collection("cartitem")
      .doc(product.id)
      .get()
      .then((d) => {
        db.collection("cart")
          .doc(userid)
          .collection("cartitem")
          .doc(product.id)
          .set({
            ...product,
            quantity: d.exists ? d?.data()?.quantity + 1 : 1,
          })
          .then(() => {
            console.log("Document successfully written!");
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
      });

    //
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          props.navigation.pop();
        }}
        style={{ position: "absolute", top: 28, zIndex: 2, left: 10 }}
      >
        <Ionicons name="arrow-back-circle-sharp" size={35} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.navigation.push("Cart")}
        style={{ position: "absolute", top: 28, zIndex: 2, right: 10 }}
      >
        <TouchableOpacity
          style={{ position: "absolute", top: -2, right: -2, zIndex: 2 }}
        >
          <Badge>{cartcount}</Badge>
        </TouchableOpacity>
        <Ionicons
          name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          size={35}
          color="white"
        />
      </TouchableOpacity>

      <ScrollView>
        <View>
          <Image style={styles.image} source={{ uri: product.imageUrl }} />
          <Animatable.View
            animation="bounceInDown"
            useNativeDriver
            style={{
              justifyContent: "flex-end",
              padding: 10,

              backgroundColor: "teal",
            }}
          >
            <Text style={{ fontSize: 25, textAlign: "center" }}>
              {product.name}
            </Text>
          </Animatable.View>
        </View>
        <View style={styles.actions}>
          <Text style={styles.price}>${product.price}</Text>
          <Button
            color={Colors.primary}
            title="Add to Cart"
            onPress={() => {
              AddnewDoc();
            }}
          />
        </View>
        <Card style={{ padding: 15, marginHorizontal: 10, marginVertical: 10 }}>
          <Text>Description</Text>
        </Card>
        <Text style={styles.description}>{product.Description}</Text>
      </ScrollView>
    </View>
  );
};

export const screenOptions = (navData) => {
  return {
    headerTitle: navData.route.params.productTitle,
  };
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
  },
  actions: {
    marginVertical: 10,
    marginHorizontal: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 20,
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "open-sans-bold",
  },
  description: {
    fontFamily: "open-sans",
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
});

export default ProductDetailScreen;
