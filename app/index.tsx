import { Redirect } from "expo-router";
//import { useAuth } from "@clerk/clerk-expo";

/*const Home = () => {
    return <Redirect href="/(auth)/sign-in" />;
};

export default Home;


import { Redirect } from "expo-router";
*/

const Home = () => {
  //const { isSignedIn } = useAuth();

  //if (isSignedIn) return <Redirect href="/(root)/(tabs)/home" />;

  return <Redirect href="/(auth)/welcome" />;
};

export default Home;