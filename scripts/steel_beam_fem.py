"""
片持ち鋼梁の材端モーメントを有限要素法(FEM)で求める。

条件:
  - 断面: 100mm x 100mm の正方形断面
  - 材長: L = 1 m
  - 荷重: 自由端に P = 100 kN の集中荷重(下向き)
  - 支持: 一端固定・他端自由(片持ち梁)

Euler-Bernoulli梁要素(1要素・節点2つ・各節点2自由度: たわみv, たわみ角θ)
の剛性マトリクスを組み立て、固定端の反力(せん断力・モーメント)から
材端モーメントを求める。
"""

# ---------- 入力条件 ----------
b = 0.100          # 断面幅 [m]
h = 0.100          # 断面せい [m]
L = 1.0            # 材長 [m]
P = 100e3          # 自由端荷重 [N] (100 kN)
E = 205e9          # 鋼のヤング率 [Pa] (E = 205 GPa)

I = b * h ** 3 / 12  # 断面二次モーメント [m^4]


def beam_element_stiffness(E, I, L):
    """Euler-Bernoulliはり要素の4x4剛性マトリクスを返す。
    自由度順序: [v1, theta1, v2, theta2]
    """
    c = E * I / L ** 3
    return [
        [12 * c,      6 * L * c,   -12 * c,      6 * L * c],
        [6 * L * c,   4 * L ** 2 * c, -6 * L * c,  2 * L ** 2 * c],
        [-12 * c,    -6 * L * c,    12 * c,      -6 * L * c],
        [6 * L * c,   2 * L ** 2 * c, -6 * L * c,  4 * L ** 2 * c],
    ]


def solve_linear_system(A, b_vec):
    """ガウスの消去法でAx=bを解く(小規模行列専用の簡易実装)。"""
    n = len(A)
    M = [row[:] + [b_vec[i]] for i, row in enumerate(A)]

    for col in range(n):
        pivot_row = max(range(col, n), key=lambda r: abs(M[r][col]))
        M[col], M[pivot_row] = M[pivot_row], M[col]
        pivot = M[col][col]
        for j in range(col, n + 1):
            M[col][j] /= pivot
        for r in range(n):
            if r != col:
                factor = M[r][col]
                for j in range(col, n + 1):
                    M[r][j] -= factor * M[col][j]

    return [M[i][n] for i in range(n)]


def mat_vec(A, x):
    return [sum(A[i][j] * x[j] for j in range(len(x))) for i in range(len(A))]


def main():
    K = beam_element_stiffness(E, I, L)

    # 節点1(固定端): v1 = 0, theta1 = 0
    # 節点2(自由端): 荷重 P(下向き), 外部モーメントなし
    # 拘束されていない自由度 [v2, theta2] のみを取り出して解く
    K_free = [[K[2][2], K[2][3]],
              [K[3][2], K[3][3]]]
    F_free = [-P, 0.0]  # 下向き荷重なので符号は上向き正の座標系で -P

    v2, theta2 = solve_linear_system(K_free, F_free)

    # 全体変位ベクトル [v1, theta1, v2, theta2]
    d = [0.0, 0.0, v2, theta2]

    # 節点力ベクトル {F} = [K]{d} -> 固定端の反力(せん断力・モーメント)を含む
    F = mat_vec(K, d)
    V1, M1 = F[0], F[1]   # 固定端(材端)のせん断反力・モーメント反力
    V2, M2 = F[2], F[3]   # 自由端側(荷重・外部モーメントとつり合う)

    # 材端モーメント(固定端に生じる曲げモーメントの大きさ)
    M_fixed_end = M1

    print("=== 断面・材料条件 ===")
    print(f"断面: {b*1000:.0f}mm x {h*1000:.0f}mm, 断面二次モーメント I = {I:.4e} m^4")
    print(f"材長 L = {L} m, ヤング率 E = {E:.3e} Pa")
    print(f"荷重 P = {P/1e3:.1f} kN (自由端, 下向き)")
    print()
    print("=== FEM計算結果 ===(符号は下向きたわみを負とする座標系)")
    print(f"自由端たわみ    v2     = {v2*1000:.4f} mm (下向き {abs(v2)*1000:.4f} mm)")
    print(f"自由端たわみ角  theta2 = {theta2:.6f} rad")
    print(f"固定端反力(せん断) V1 = {V1/1e3:.2f} kN")
    print(f"固定端材端モーメント M = {M_fixed_end/1e3:.2f} kN・m")
    print()

    # ---------- 理論解との照合(片持ち梁・先端集中荷重) ----------
    v2_theory = P * L ** 3 / (3 * E * I)
    theta2_theory = P * L ** 2 / (2 * E * I)
    M_theory = P * L

    print("=== 理論解(材料力学)との比較 ===")
    print(f"たわみ理論値     v2 = {v2_theory*1000:.4f} mm")
    print(f"たわみ角理論値 theta = {theta2_theory:.6f} rad")
    print(f"材端モーメント理論値 M = {M_theory/1e3:.2f} kN・m")


if __name__ == "__main__":
    main()
