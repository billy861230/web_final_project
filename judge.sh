g++ main.cpp -o main
./main < probs/$1/1.in > test_1
diff test_1 probs/$1/1.out > result_1

./main < probs/$1/2.in > test_2
diff test_1 probs/$1/2.out > result_2
