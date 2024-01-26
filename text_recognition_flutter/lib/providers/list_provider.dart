import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:flutter/material.dart';

class ResultProvider extends ChangeNotifier {
  late String _keyfeatures;
  late String _sideeffects;
  late String _reviews;
  late double _rating;

  String get keyfeatures => _keyfeatures;
  String get sideeffects => _sideeffects;
  String get reviews => _reviews;
  double get rating => _rating;

  Future<Null> keyfeaturesnsideeffects(String text) async {
    String api = 'http://192.168.137.241:5000';
    String url = api + text;
    try {
      var response = await http.get(Uri.parse(url));
      var jsonData = jsonDecode(response.body);
      _keyfeatures = jsonData['results'][0]['description'];
      _sideeffects = jsonData['results'][0]['adverse_reactions'];
      _reviews = jsonData['results'][0]['openfda']['manufacturer_name'][0];
      _rating = jsonData['results'][0]['rating'];
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
          .map<String>(
              (e) => e.toString().replaceAll(' ', '_').replaceAll('/', '_'))
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
          .map<String>(
              (e) => e.toString().replaceAll(' ', '_').replaceAll('/', '_'))
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
      _drugs = jsonData['drugNames'];
    } catch (e) {
      rethrow;
    }
    return null;
  }
}
