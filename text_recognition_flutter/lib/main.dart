import 'package:flutter/material.dart';
import 'package:text_recognition_flutter/providers/list_provider.dart';
import 'home_screen.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(
     MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => ListProvider()),
        ChangeNotifierProvider(create: (context) => ResultProvider()),
        // Add more providers as needed
      ],
      child: const App(),
     ),
  );
}

class App extends StatefulWidget {
  const App({super.key});

  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  @override
  Widget build(BuildContext context) {
    Provider.of<ListProvider>(context, listen: false).getDrugs();
    Provider.of<ListProvider>(context, listen: false).getDiseases();

    return MaterialApp(
      title: 'DrugRec',
      theme: ThemeData(
        colorScheme: ColorScheme.light(
          primary: Colors.cyan.shade400,
          secondary: Colors.blueAccent,
        ),
        appBarTheme: AppBarTheme(
          backgroundColor: Colors.cyan.shade200,
        ),
      ),
      home: const HomeScreen(),
    );
  }
}
