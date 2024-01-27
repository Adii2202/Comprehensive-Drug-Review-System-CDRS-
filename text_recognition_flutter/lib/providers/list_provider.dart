import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:flutter/material.dart';

class ResultProvider extends ChangeNotifier {
  String _keyfeatures = '';
  String _sideeffects = '';
  String _reviews = '';
  double _rating = 0.0;

  String get keyfeatures => _keyfeatures;
  String get sideeffects => _sideeffects;
  String get reviews => _reviews;
  double get rating => _rating;

  Future<Null> keyfeaturesnsideeffects(String text) async {
    String api = 'http://192.168.137.241:5000/getdrugreview/';
    String url = api + text;
    try {
      var response = await http.get(Uri.parse(url));
      var jsonData = jsonDecode(response.body);
      _reviews =
          jsonData["reviews"].toString();
      print(_reviews);
      notifyListeners();
    } catch (e) {
      print(e);
      rethrow;
    }
    return null;
  }

  Future<Null> getdrugcat(String text) async {
    String api = 'http://192.168.137.241:5000/getdrugcat/';
    String url = api + text;
    try {
      var response = await http.get(Uri.parse(url));
      var jsonData = jsonDecode(response.body);
      _rating = jsonData['Rating'].toDouble();
      notifyListeners();
    } catch (e) {
      print(e);
      rethrow;
    }
    return null;
  }

  Future<Null> getsideeffects(String text) async {
    String api = 'http://192.168.137.241:5000/getsideeffect/';
    String url = api + text;
    try {
      var response = await http.get(Uri.parse(url));
      var jsonData = jsonDecode(response.body);
      _sideeffects = jsonData['sideEffects'].toString();
      notifyListeners();
    } catch (e) {
      print(e);
      rethrow;
    }
    return null;
  }

  Future<Null> getkeyfeatures(String text) async {
    String api = 'http://192.168.137.241:5000/getKeyfeatures/';
    String url = api + text;
    try {
      var response = await http.get(Uri.parse(url));
      var jsonData = jsonDecode(response.body);
      _keyfeatures = jsonData['keyFeatures'];
      notifyListeners();
    } catch (e) {
      print(e);
      rethrow;
    }
    return null;
  }
}

class ListProvider extends ChangeNotifier {
  List<String> _drugs = [];
  List<String> _diseases = [];

  List<String> get drugs => _drugs;
  List<String> get diseases => _diseases;

  Future<Null> getdrugNames() async {
    print("calling to get drug names");
    String url = 'http://192.168.137.241:5000/drug-names';
    try {
      var res = await http.get(Uri.parse(url));
      var jsonData = jsonDecode(res.body);
      _drugs = jsonData['drugNames']
          .map<String>((e) => e.toString().replaceAll('/', '_'))
          .toList();
      print(_drugs);
    } catch (e) {
      print(e);
      rethrow;
    }
    print("done calling");
    return null;
  }

  Future<Null> getdiseaseNames() async {
    print("calling to get disease names");
    String url = 'http://192.168.137.241:5000/drug-condition';
    try {
      var res = await http.get(Uri.parse(url));
      var jsonData = jsonDecode(res.body);
      print(jsonData['drugCondition'].runtimeType);
      _diseases = jsonData['drugCondition']
          .map<String>((e) => e.toString().replaceAll('/', '_'))
          .toList();
    } catch (e) {
      print(e);
      rethrow;
    }
    print("done calling");
    return null;
  }

  Future<Null> getMedFromDisease(String disease) async {
    String url = 'http://192.168.137.241:5000/drug-names/${disease}';
    try {
      var res = await http.get(Uri.parse(url));
      var jsonData = jsonDecode(res.body);
      _drugs = jsonData['drugNames'].map<String>((e) => e.toString()).toList();
    } catch (e) {
      rethrow;
    }
    return null;
  }
}
